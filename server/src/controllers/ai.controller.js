import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
import AppError from '../utils/appError.js';
import { generateAIResponse } from '../services/ai.service.js';

// Generate incident summary
export const getIncidentSummary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id).populate('service');
    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    const updates = await Update.find({ incident: id }).sort({
      createdAt: 1,
    });

    const recentUpdates = updates.length > 0 ? updates.slice(-5) : [];

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

Title: ${incident.title}
Description: ${incident.description}
Service:
  Name: ${incident.service?.name}
  Type: ${incident.service?.type}
  Tech Stack: ${incident.service?.techStack?.join(', ')}
Severity: ${incident.severity}
Status: ${incident.status}

Updates:
${recentUpdates.map((u) => '- ' + u.message).join('\n')}
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

// 🧠 Generate basic root cause suggestion
export const getIncidentRootCause = async (req, res, next) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id).populate('service');
    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    const updates = await Update.find({ incident: id });

    const recentUpdates = updates.length > 0 ? updates.slice(-5) : [];

    const prompt = `
You are an incident analysis AI.

Given the service context, incident details, and timeline, determine the most likely root cause.

Rules:
- Provide 1–3 possible causes ranked by likelihood.
- Return ONLY a valid JSON array of strings.
- Example output: ["Possible memory leak in Node.js process", "Database connection pool exhaustion"]
- Be concise.
- Focus on technical cause based on the tech stack.

Service:
  Name: ${incident.service?.name}
  Type: ${incident.service?.type}
  Tech Stack: ${incident.service?.techStack?.join(', ')}

Incident:
Title: ${incident.title}
Description: ${incident.description}

Updates:
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
