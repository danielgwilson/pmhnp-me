import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateResponse } from "./lib/openai";

export function registerRoutes(app: Express): Server {
  // Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ message: "OpenAI API key not configured" });
      }

      const { topic, message } = req.body;

      if (!topic || !message) {
        return res.status(400).json({ message: "Topic and message are required" });
      }

      const response = await generateResponse(topic, message);
      res.json({ response });
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}