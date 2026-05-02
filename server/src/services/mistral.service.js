import { Mistral } from '@mistralai/mistralai';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

const client = new Mistral({ apiKey: config.MISTRAL_API_KEY });

export const generateMistralResponse = async (prompt) => {
  try {
    if (!config.MISTRAL_API_KEY) {
      throw new Error('Mistral API Key is missing');
    }

    const response = await client.chat.complete({
      model: 'mistral-medium-latest',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
      throw new Error('Empty response from Mistral');
    }

    return text;
  } catch (error) {
    logger.error('Mistral Service Error:', error.message);
    throw error;
  }
};