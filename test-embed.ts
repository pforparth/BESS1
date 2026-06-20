import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-2-preview",
      contents: "Hello world"
    });
    console.log(response.embeddings[0].values.slice(0, 5));
  } catch (e) {
    console.error(e);
  }
}
run();
