import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const listRes = await ai.models.list();
    for await (const model of listRes) {
      if (model.name.includes("embedding")) {
        console.log(model.name);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
run();
