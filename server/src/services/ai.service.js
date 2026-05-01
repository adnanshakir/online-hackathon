import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config.js';
import AppError from '../utils/appError.js';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

export const generateAIResponse = async (prompt) => {
  try {
    if (!config.GEMINI_API_KEY) {
      throw new AppError('AI Service: API Key is missing', 500);
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new AppError('AI Service: Empty response from Gemini', 500);
    }

    return text;
  } catch (error) {
    logger.error('Gemini AI Error:', error.message);
    
    // Check for specific API key errors
    if (error.message.includes('API_KEY_INVALID')) {
      throw new AppError('AI Service: Invalid API Key provided.', 500);
    }

    throw new AppError('AI Service failed to generate response.', 500);
  }
};