import { GoogleGenAI } from "@google/genai";
import { RPPGMetrics } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

// Initialize only if key exists, otherwise we handle gracefully
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export const analyzeHealthMetrics = async (metrics: RPPGMetrics, name: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Returning mock analysis.");
    return "AI Analysis unavailable (Missing API Key). Employee shows standard vitals.";
  }

  try {
    const prompt = `
      Act as a workplace health safety AI. Analyze the following rPPG health metrics for employee ${name}.
      
      Metrics:
      - Heart Rate: ${metrics.heartRate} bpm
      - Respiration Rate: ${metrics.respirationRate} rpm
      - SpO2: ${metrics.spo2}%
      - Blood Pressure: ${metrics.bloodPressureSys}/${metrics.bloodPressureDia} mmHg
      - Stress Level: ${metrics.stressLevel}/100

      Determine if the status is 'Good' or 'Risk' based on general medical knowledge. 
      Provide a ONE sentence summary of their condition. Do not provide medical advice, just an operational status observation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Analysis completed.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Analysis failed due to connectivity issues.";
  }
};
