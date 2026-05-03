import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

export const generateGeminiResponse = async (prompt) => {
  try {
    if (!config.GEMINI_API_KEY) {
      throw new Error('Gemini API Key is missing');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    return text;
  } catch (error) {
    logger.error('Gemini Service Error:', error.message);
    throw error;
  }
};
