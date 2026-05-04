import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
import { Workspace } from '../models/workspace.model.js';
import AppError from '../utils/appError.js';
import { generateAIResponse } from '../services/ai.service.js';

// Generate incident summary
export const getIncidentSummary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findOne({
      _id: id,
      workspace: req.user.workspace,
    }).populate(
      'service',
      'name type environment description status'
    );

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    const [recentUpdates, workspace] = await Promise.all([
      Update.find({
        incident: id,
        workspace: req.user.workspace,
      })
        .sort({ createdAt: -1 })
        .limit(5),
      Workspace.findById(req.user.workspace).select('systemContext'),
    ]);
    recentUpdates.reverse();

    const ctx = workspace?.systemContext ?? {};

    const prompt = `
You are an incident management AI.

Summarize the incident for a public status page.

Rules:
- Keep it concise (2–3 sentences max)
- No greetings or apologies
- Focus on issue, impact, and resolution
- Professional tone
- **Plain text ONLY (NO Markdown, no **, no #)**
- **Single paragraph only (no newlines)**

System Context:
  Project: ${ctx.projectName || 'Not specified'}
  Stack: ${ctx.stackPreset || 'Not specified'}
  Tech Stack: ${ctx.techStack?.join(', ') || 'Not specified'}
  Integrations: ${ctx.integrations?.join(', ') || 'None'}

Service:
  Name: ${incident.service?.name ?? 'Unknown'}
  Type: ${incident.service?.type ?? 'Unknown'}
  Environment: ${incident.service?.environment ?? 'Unknown'}
  Description: ${incident.service?.description || 'Not provided'}
  Status: ${incident.service?.status ?? 'Unknown'}

Incident:
  Title: ${incident.title}
  Description: ${incident.description}
  Severity: ${incident.severity}
  Status: ${incident.status}

Timeline Updates:
${recentUpdates.length > 0 ? recentUpdates.map((u) => '- ' + u.message).join('\n') : 'No updates yet.'}
`;

    const summary = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    return next(error);
  }
};

// Generate root cause analysis
export const getIncidentRootCause = async (req, res, next) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findOne({
      _id: id,
      workspace: req.user.workspace,
    }).populate(
      'service',
      'name type environment description status'
    );

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    const [recentUpdates, workspace] = await Promise.all([
      Update.find({
        incident: id,
        workspace: req.user.workspace,
      })
        .sort({ createdAt: -1 })
        .limit(5),
      Workspace.findById(req.user.workspace).select('systemContext'),
    ]);
    recentUpdates.reverse();

    const ctx = workspace?.systemContext ?? {};

    const prompt = `
You are an incident analysis AI.

Given the service context, incident details, and timeline, determine the most likely root cause.

Rules:
- Provide 1–3 possible causes ranked by likelihood.
- Return ONLY a valid JSON array of strings.
- Example output: ["Possible memory leak in Node.js process", "Database connection pool exhaustion"]
- Be concise.
- Focus on technical causes based on the service type, tech stack, and environment.
- Consider the environment: a ${incident.service?.environment ?? 'production'} environment may have different failure patterns.

System Context:
  Project: ${ctx.projectName || 'Not specified'}
  Stack: ${ctx.stackPreset || 'Not specified'}
  Tech Stack: ${ctx.techStack?.join(', ') || 'Not specified'}
  Integrations: ${ctx.integrations?.join(', ') || 'None'}

Service:
  Name: ${incident.service?.name ?? 'Unknown'}
  Type: ${incident.service?.type ?? 'Unknown'}
  Environment: ${incident.service?.environment ?? 'Unknown'}
  Description: ${incident.service?.description || 'Not provided'}
  Status: ${incident.service?.status ?? 'Unknown'}

Incident:
  Title: ${incident.title}
  Description: ${incident.description}
  Severity: ${incident.severity}

Timeline Updates:
${recentUpdates.length > 0 ? recentUpdates.map((u) => '- ' + u.message).join('\n') : 'No updates yet.'}
`;

    const aiResponse = await generateAIResponse(prompt);

    let analysis;
    try {
      // Clean the response in case AI adds markdown blocks
      const cleanJson = aiResponse.replace(/```json|```/g, '').trim();
      analysis = JSON.parse(cleanJson);

      if (!Array.isArray(analysis)) {
        analysis = [aiResponse]; // Fallback if it's not an array
      }
    } catch (e) {
      // Fallback if parsing fails
      analysis = [aiResponse];
    }

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    return next(error);
  }
};

// Generate root cause suggestions for a NEW incident based on workspace context
export const suggestIncidentCauses = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title && !description) {
      throw new AppError('Please provide a title or description', 400);
    }

    const workspace = await Workspace.findById(req.user.workspace).select(
      'systemContext'
    );
    const ctx = workspace?.systemContext ?? {};

    const prompt = `
You are an expert SRE assistant analyzing a new, unsubmitted incident report.

Determine the most likely root causes using the provided Workspace System Context.

Rules:
- Return a JSON array of exactly 3 probable root causes.
- Each item must have exactly these keys:
  - "title": short cause name (max 8 words)
  - "probability": float 0-1
  - "reasoning": 1-2 sentence explanation
  - "checks": array of 3 short diagnostic checks
- Focus heavily on technical causes based on the provided Tech Stack and Integrations.
- Return ONLY the JSON array, no markdown blocks, no commentary.

System Context:
  Project: ${ctx.projectName || 'Not specified'}
  Stack: ${ctx.stackPreset || 'Not specified'}
  Tech Stack: ${ctx.techStack?.join(', ') || 'Not specified'}
  Integrations: ${ctx.integrations?.join(', ') || 'None'}
  Architecture Notes: ${ctx.architectureNotes || 'None'}

Incident Report:
  Title: ${title || 'N/A'}
  Description: ${description || 'N/A'}
`;

    const aiResponse = await generateAIResponse(prompt);

    let suggestions = [];
    try {
      const cleanJson = aiResponse.replace(/```json|```/g, '').trim();
      suggestions = JSON.parse(cleanJson);
    } catch (e) {
      console.error(
        '[ai.controller] Failed to parse suggestions:',
        e.message,
        aiResponse
      );
      suggestions = [];
    }

    return res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    return next(error);
  }
};

// Polish incident title and description
export const polishIncidentDetails = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title && !description) {
      throw new AppError('Please provide a title or description', 400);
    }

    const prompt = `You are a Principal Site Reliability Engineer (SRE). Your task is to transform the provided informal notes into a high-fidelity, professional, and authoritative incident update.

Original Notes:
Title: ${title || 'N/A'}
Description: ${description || 'N/A'}

Rules:
1. Fix spelling and grammar mistakes ONLY if the input is recognizable language.
2. Use professional, calm, and technically accurate language.
3. IMPORTANT: If the input is gibberish, meaningless, or lacks any technical context (e.g., "asdf", "test"), DO NOT invent facts. In such cases, return the original input for both title and description.
4. Return ONLY a valid JSON object with keys "title" and "description".
5. Return only raw JSON. No markdown code blocks.`;

    const aiResponse = await generateAIResponse(prompt);

    let polished = { title: title || '', description: description || '' };
    try {
      // 1. Aggressively extract the JSON block
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      let jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      
      // 2. Fix literal newlines that break JSON.parse
      // (Replaces literal newlines with \n escape characters)
      jsonString = jsonString.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
      
      // 3. Attempt parse
      const parsed = JSON.parse(jsonString);
      if (parsed.title || parsed.description) {
        polished = {
          title: (parsed.title || title || '').trim(),
          description: (parsed.description || description || '').trim()
        };
      }
    } catch (e) {
      console.warn('[ai.controller] Deep JSON parse failed, manual extraction:', e.message);
      
      // 4. Final Fallback: Manual extraction using regex if JSON.parse still fails
      const titleMatch = aiResponse.match(/"title":\s*"([^"]*)"/);
      const descMatch = aiResponse.match(/"description":\s*"([\s\S]*)"/);
      
      polished = {
        title: titleMatch ? titleMatch[1] : (title || 'Incident Update'),
        description: descMatch ? descMatch[1].replace(/```json\n?|```/g, '').replace(/\}$/g, '').trim() : aiResponse.replace(/```json\n?|```/g, '').trim()
      };
    }

    return res.status(200).json({
      success: true,
      polished
    });
  } catch (error) {
    return next(error);
  }
};
