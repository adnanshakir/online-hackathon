import { Incident } from '../models/incident.model.js';
import { Update } from '../models/update.model.js';
import AppError from '../utils/appError.js';
import { generateAIResponse } from '../services/ai.service.js';

// Generate incident summary
export const getIncidentSummary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id);
    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    const updates = await Update.find({ incident: id }).sort({
      createdAt: 1,
    });

    if (!updates.length) {
      return res.status(200).json({
        success: true,
        summary: 'No updates available for this incident yet.',
      });
    }

    const recentUpdates = updates.slice(-5);

    const prompt = `
You are an incident management AI.

Summarize the incident for a public status page.

Rules:
- Keep it concise (2–3 sentences max)
- No greetings or apologies
- Focus on issue, impact, and resolution
- Professional tone

Title: ${incident.title}
Description: ${incident.description}
Service: ${incident.service}
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

    const incident = await Incident.findById(id);
    if (!incident) {
      throw new AppError('Incident not found', 404);
    }

    const updates = await Update.find({ incident: id });

    if (!updates.length) {
      return res.status(200).json({
        success: true,
        rootCause: 'Not enough data to determine root cause.',
      });
    }

    const recentUpdates = updates.slice(-5);

    const prompt = `
You are an incident analysis AI.

Analyze the following incident updates and determine the most likely root cause.

Rules:
- Be concise (1–2 sentences)
- Do NOT repeat updates
- Do NOT guess wildly
- Use "likely" if uncertain
- Focus on technical cause, not symptoms

Incident:
Title: ${incident.title}
Description: ${incident.description}
Service: ${incident.service}

Updates:
${recentUpdates.map((u) => '- ' + u.message).join('\n')}
`;

    const rootCause = await generateAIResponse(prompt);

    return res.status(200).json({
      success: true,
      rootCause,
    });
  } catch (error) {
    return next(error);
  }
};
