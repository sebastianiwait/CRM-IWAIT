import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Safe API route for Gemini generations
  app.post('/api/generate', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error: 'Gemini API Key is not configured. Please open the Settings > Secrets panel in Google AI Studio to set your GEMINI_API_KEY.',
          isConfigError: true
        });
      }

      const { prompt, systemInstruction, temperature, topP, responseType, responseSchema } = req.body;
      
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const config: any = {};
      
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }
      if (temperature !== undefined) {
        config.temperature = Number(temperature);
      }
      if (topP !== undefined) {
        config.topP = Number(topP);
      }
      
      if (responseType === 'json') {
        config.responseMimeType = 'application/json';
        if (responseSchema) {
          config.responseSchema = responseSchema;
        }
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: config,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Error in Gemini generation API route:', error);
      res.status(500).json({ 
        error: error?.message || 'An unexpected error occurred while communicating with the Gemini API.' 
      });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    // Development middleware using Vite dev server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite loaded in Express dev middleware mode.');
  } else {
    // Production serving of built assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('Production static files server configured.');
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server successfully started on http://0.0.0.0:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Fatal: Failed to start the Express server:', error);
});
