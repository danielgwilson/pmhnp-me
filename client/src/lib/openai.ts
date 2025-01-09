import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });

export async function generateResponse(topic: string, message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a PMHNP-BC exam preparation assistant. You provide concise, accurate, and engaging responses about ${topic}. Keep responses brief and conversational.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 150,
    });

    return response.choices[0].message.content || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I apologize, I'm having trouble connecting. Please try again.";
  }
}
