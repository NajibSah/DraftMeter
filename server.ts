import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Private AI Analysis Route
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey.trim() === "" || apiKey === "YOUR_API_KEY") {
        console.error("GEMINI_API_KEY is not configured on the server.");
        return res.status(500).json({ error: "Server configuration error: Missing API key." });
      }

      if (!text) {
        return res.status(400).json({ error: "No text provided" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are a world-class critical editor. Provide a rigorous, unvarnished analysis of the provided text. Focus on identifying structural weaknesses, logical gaps, and stylistic inconsistencies. Return a JSON object with: 'score' (0-100 reflecting structural maturity), 'summary' (a brief overview), 'critique' (a detailed critical evaluation of flaws and weaknesses, max 100 words), and 'tips' (3 actionable strategies for improvement).
      
      Text to analyze:
      ${text}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      if (!response.text) {
        throw new Error("No response text from AI");
      }

      let responseText = response.text.trim();
      
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("AI Analysis error:", error);
      res.status(503).json({ error: "Analysis service currently unavailable. Please try again in a moment." });
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
    // Production: Serve static files from dist
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    
    // SPA Fallback: Serve index.html for any unknown route
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      console.log(`SPA Fallback: Serving ${indexPath} for ${req.url}`);
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error("Fallback error:", err);
          res.status(404).send("Index.html not found. Please build the app first.");
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
