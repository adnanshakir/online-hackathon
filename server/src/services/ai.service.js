import { generateGeminiResponse } from './gemini.service.js';
import { generateMistralResponse } from './mistral.service.js';
import { logger } from '../utils/logger.js';
import AppError from '../utils/appError.js';

/**
 * Wraps a promise with a timeout
 * @param {Promise} promise
 * @param {number} ms
 */
const withTimeout = (promise, ms = 3000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
};

/**
 * Main AI Response generator with Mistral -> Gemini failover
 * @param {string} prompt
 */
export const generateAIResponse = async (prompt) => {
  // 1. Try Mistral First
  try {
    logger.info('AI Service: Attempting Mistral...');
    return await withTimeout(generateMistralResponse(prompt), 15000);
  } catch (mistralError) {
    logger.warn(
      `AI Service: Mistral failed (${mistralError.message}). Falling back to Gemini...`
    );

    // 2. Fallback to Gemini
    try {
      logger.info('AI Service: Attempting Gemini...');
      return await withTimeout(generateGeminiResponse(prompt), 15000);
    } catch (geminiError) {
      logger.error(
        `AI Service: All providers failed. Gemini error: ${geminiError.message}`
      );

      throw new AppError(
        `AI Service failed to generate response. (Mistral: ${mistralError.message}, Gemini: ${geminiError.message})`,
        500
      );
    }
  }
};
