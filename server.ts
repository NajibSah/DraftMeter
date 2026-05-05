import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Analysis Route
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      if (!text) {
        return res.status(400).json({ error: "Text is required for analysis." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are an expert editor. Analyze the draft given for clarity, tone, and flow. Return a JSON object with 'score' (0-100), 'summary' (max 60 words), and 'tips' (array of 3 specific improvements).",
          responseMimeType: "application/json",
        },
        contents: text
      });

      if (!response.text) {
        throw new Error("No response text from AI");
      }
      
      const analysis = JSON.parse(response.text);
      res.json(analysis);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      res.status(500).json({ error: "Failed to analyze text. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
