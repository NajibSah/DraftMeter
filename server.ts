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
