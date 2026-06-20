import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
// @ts-expect-error Types missing default
import pdfParse from "pdf-parse";

dotenv.config();

// In-Memory Vector Store for RAG
interface DocChunk {
    text: string;
    embedding: number[];
}
let vectorStore: DocChunk[] = [];

// Cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // PDF Upload Route
  app.post("/api/upload-pdf", upload.single("pdf"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const data = await pdfParse(req.file.buffer);
      const text = data.text;
      
      // Basic text chunking
      const chunks: string[] = [];
      const MAX_CHUNK_SIZE = 1000;
      let currentIndex = 0;
      while (currentIndex < text.length) {
        chunks.push(text.slice(currentIndex, currentIndex + MAX_CHUNK_SIZE));
        currentIndex += MAX_CHUNK_SIZE;
      }
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(400).json({ error: "GEMINI_API_KEY is missing." });
      
      const ai = new GoogleGenAI({ apiKey });
      const newChunks: DocChunk[] = [];
      
      // Sequentially generate embeddings to respect rate limits
      for (const chunk of chunks) {
        if (!chunk.trim()) continue;
        const response = await ai.models.embedContent({
          model: "gemini-embedding-2-preview",
          contents: chunk
        });
        const embedding = response.embeddings?.[0]?.values;
        if (embedding) {
            newChunks.push({ text: chunk, embedding });
        }
      }
      
      vectorStore.push(...newChunks);
      
      res.json({ success: true, chunksCount: newChunks.length, totalChunks: vectorStore.length });
    } catch (e: any) {
      console.error("PDF upload error:", e);
      res.status(500).json({ error: e.message || "Failed to process PDF" });
    }
  });

  // API Route - Chat with Gemini BESS Expert
  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({ 
          text: "I am ready to help, but the **GEMINI_API_KEY** is not configured. Please add your key in the **Secrets** panel in the bottom-left sidebar of Google AI Studio to unlock full interactive consulting!" 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // RAG Retrieval
      let retrievedContext = "";
      if (vectorStore.length > 0) {
        try {
            const embedRes = await ai.models.embedContent({
                model: "gemini-embedding-2-preview",
                contents: message
            });
            const queryEmbedding = embedRes.embeddings?.[0]?.values;
            if (queryEmbedding) {
                // Calculate scores
                const scoredDocs = vectorStore.map(doc => ({
                    text: doc.text,
                    score: cosineSimilarity(queryEmbedding, doc.embedding)
                }));
                // Sort descending
                scoredDocs.sort((a, b) => b.score - a.score);
                // Take top 3 chunks
                const topDocs = scoredDocs.slice(0, 3);
                retrievedContext = "Relevant Document Excerpts:\n" + topDocs.map(d => "---\n" + d.text + "\n---").join("\n");
            }
        } catch (err) {
            console.error("RAG Retrieval error:", err);
        }
      }

      // Prepare contents containing history + current message
      const contents: any[] = [];
      
      if (Array.isArray(history)) {
        history.forEach((msg: any) => {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          });
        });
      }
      
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: "You are highly knowledgeable, professional BESS India Trading Advisor. Your goal is to help BESS traders, end-user entities, and C&I facility managers in India configure and buy optimal storage systems from domestic manufacturers.\n" +
"You can discuss:\n" +
"1. Sourcing Partnerships: Major domestic players such as Reliance New Energy, Tata AutoComp Systems, Exide Energy Solutions, Amara Raja, Sterling & Wilson, and L&T Green Energy. Explain how traders can work with them.\n" +
"2. Battery Chemistries simplified: Lithium-Iron Phosphate [LFP] (preferred for high-temperature Indian climates safe up to 270°C), Sodium-ion [Na-ion] (cost-effective for microgrids), Vanadium Redox Flow [VRFB], and NMC (hazardous high-temp runaway risk at 210°C).\n" +
"3. Strategic Dispatch Tactics (Peak Shaving under State DISCOM tariffs like BESCOM, MSEDCL, TANGEDCO; solar storage absorption; and diesel generator replacement offsets).\n" +
"4. Core Tech metrics: Round-Trip Efficiency (RTE), cycle lifetimes, and LCOS (Levelized Cost of Storage in Rupees/unit).\n\n" +
(retrievedContext ? "IMPORTANT: Use the following retrieved document excerpts to inform your answer. If they contain relevant information, synthesize it into your response.\n" + retrievedContext + "\n\n" : "") +
"Give crisp, structured answers using Markdown bullet points. Keep explanations extremely simple and non-technical for end-user business managers. Keep responses under 2-3 short paragraphs.",
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error.message || error);
      res.status(500).json({ error: error.message || "An error occurred with the Gemini API. Please check your API configuration." });
    }
  });

  // API Route - System sizing recommendations / estimations
  app.post("/api/size-estimator", async (req, res) => {
    try {
      const { 
        facilityType, 
        avgDailyConsumptionKwh, 
        peakDemandKw, 
        solarOutputKw, 
        backupRequirementHours,
        primaryGoal 
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      
      // If API key is missing, mock some calculations to let the app work gracefully!
      if (!apiKey) {
        // Simple mechanical calculations if API key is not present
        const cap = Math.round((Math.max(avgDailyConsumptionKwh * 0.35, backupRequirementHours * peakDemandKw * 0.5) / 100) * 10) / 10;
        const recommendedCapacityMwh = Math.max(0.01, cap);
        const recommendedPowerMw = Math.round((peakDemandKw * 1.1 / 1000) * 100) / 100;
        const durationHours = Math.round((recommendedCapacityMwh * 1000 / (recommendedPowerMw * 1000)) * 10) / 10 || 4;
        const estimatedFootprintSqM = Math.round(recommendedCapacityMwh * 45);
        const estimatedCostSavingsYearlyUSD = Math.round(avgDailyConsumptionKwh * 365 * 0.08 * (primaryGoal === 'arbitrage' ? 1.4 : 1.1));
        const estimatedCo2ReductionTonnes = Math.round(recommendedCapacityMwh * 1000 * 0.380);
        const roiYears = Math.round((recommendedCapacityMwh * 400000 / (estimatedCostSavingsYearlyUSD || 1)) * 10) / 10;
        
        return res.json({
          systemType: facilityType === "residential" ? "LFP Rack Solutions (Residential Modular)" : "Commercial Containerized (Liquid Cooled)",
          recommendedCapacityMwh,
          recommendedPowerMw: recommendedPowerMw || 0.05,
          durationHours: durationHours || 4,
          estimatedFootprintSqM: Math.max(2, estimatedFootprintSqM),
          estimatedCostSavingsYearlyUSD,
          estimatedCo2ReductionTonnes,
          roiYears: Math.min(10, Math.max(3.5, roiYears)),
          chemistryRecommendation: "Lithium Iron Phosphate (LFP) for thermal safety and excellent lifecycle performance.",
          reasoning: `Based on your average consumption of ${avgDailyConsumptionKwh} kWh and peak demand of ${peakDemandKw} kW, we calculated a modular BESS system. Local storage matches excess daytime solar/off-peak grid input to dispatch power cleanly when grid charges peak.`,
          bmsSettingsSummary: "Prioritizes charging during minimum tariffs (or solar abundance) and discharging to offset peak demand charges of kW spikes."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Perform a realistic, rigorous, and logically compliant battery energy storage system (BESS) sizing estimate based on these parameters:
- Facility/Application Type: ${facilityType}
- Average Daily Energy Consumption: ${avgDailyConsumptionKwh} kWh
- Peak Demand: ${peakDemandKw} kW
- Co-located Solar PV Generation Capacity: ${solarOutputKw} kW
- Desired Backup Run-time: ${backupRequirementHours} hours
- Primary Optimization Goal: ${primaryGoal}

Guidelines:
- Return the capacities in peak MWh and power in MW. Note that 1 MWh = 1000 kWh. Power should be in MW (1 MW = 1000 kW). For small residential, recommendations should be very reasonable (e.g. 0.015 MWh = 15 kWh, 0.005 MW = 5 kW).
- Ensure the JSON is grammatically sound, complete, and contains reasonable ROI years (e.g., between 4 and 10 years).
- Return ESTIMATIONS as exact scientific numbers, not strings.
- Incorporate Indian climate parameters, local manufacturer fits (Tata AutoComp, Exide, Reliance), local C&I contexts, and Rupees (₹/unit) in your text fields.

Respond ONLY with a valid JSON object matching the following structure. Do not wrap the JSON in markdown code fences like \`\`\`json. Just give the raw JSON content:
{
  "systemType": "LFP Rack Solutions / Commercial Containerized / Residential Modular",
  "recommendedCapacityMwh": 0.25,
  "recommendedPowerMw": 0.1,
  "durationHours": 2.5,
  "estimatedFootprintSqM": 12,
  "estimatedCostSavingsYearlyUSD": 14500,
  "estimatedCo2ReductionTonnes": 32.4,
  "roiYears": 6.8,
  "chemistryRecommendation": "Lithium Iron Phosphate (LFP) due to exceptional thermal safety margins supporting 45+ degree C Indian summer peaks.",
  "reasoning": "A paragraph explaining how this battery balances peak shaving load profiles, coordinates with solar, and saves the Indian enterprise peak tariffs.",
  "bmsSettingsSummary": "Charge battery at low tariffs (₹4.5/unit); discharge to offset maximum demand charges (₹14/unit) during peak slots."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });

      const resultText = response.text || "{}";
      const cleaned = resultText.trim().replace(/^```json/, '').replace(/```$/, '');
      res.json(JSON.parse(cleaned));
    } catch (error: any) {
      console.error("Estimate Error:", error.message || error);
      // Return a graceful fallback if something goes wrong
      res.status(200).json({
        systemType: "Standard LFP Modular Array",
        recommendedCapacityMwh: 0.15,
        recommendedPowerMw: 0.05,
        durationHours: 3,
        estimatedFootprintSqM: 8,
        estimatedCostSavingsYearlyUSD: 8500,
        estimatedCo2ReductionTonnes: 14.5,
        roiYears: 7.2,
        chemistryRecommendation: "Lithium Iron Phosphate (LFP)",
        reasoning: "A durable system sized on your consumption profile. This safeguards your site from grid volatility and improves self-consumption.",
        bmsSettingsSummary: "Grid Peak Load shaving and active thermal cycle cooling."
      });
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
