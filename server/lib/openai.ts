import OpenAI from 'openai';
import { config } from '../config/env';

if (!config.openai.apiKey) {
  throw new Error(
    'OpenAI API key is missing. Please set either OPENAI_API_KEY or VITE_OPENAI_API_KEY in your environment.'
  );
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: config.openai.apiKey });

export async function generateResponse(
  topic: string,
  message: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a PMHNP-BC exam preparation assistant. You provide concise, accurate, and engaging responses about ${topic}. Keep responses brief and conversational.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 150,
    });

    return (
      response.choices[0].message.content ||
      "I apologize, I couldn't generate a response."
    );
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}
