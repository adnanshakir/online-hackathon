import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
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
      'name type techStack environment description status'
    );

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    const recentUpdates = await Update.find({
      incident: id,
      workspace: req.user.workspace,
    })
      .sort({ createdAt: -1 })
      .limit(5);
    recentUpdates.reverse();

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

Service:
  Name: ${incident.service?.name ?? 'Unknown'}
  Type: ${incident.service?.type ?? 'Unknown'}
  Tech Stack: ${incident.service?.techStack?.join(', ') || 'Not specified'}
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
      'name type techStack environment description status'
    );

    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    const recentUpdates = await Update.find({
      incident: id,
      workspace: req.user.workspace,
    })
      .sort({ createdAt: -1 })
      .limit(5);
    recentUpdates.reverse();

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

Service:
  Name: ${incident.service?.name ?? 'Unknown'}
  Type: ${incident.service?.type ?? 'Unknown'}
  Tech Stack: ${incident.service?.techStack?.join(', ') || 'Not specified'}
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
