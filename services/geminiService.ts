import { GoogleGenAI } from "@google/genai";
import { RPPGMetrics } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

// Initialize only if key exists, otherwise we handle gracefully
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

export const analyzeHealthMetrics = async (metrics: RPPGMetrics, name: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Returning mock analysis.");
    return "AI 분석 불가 (API 키 누락). 직원의 생체 신호는 표준 범위 내로 보입니다.";
  }

  try {
    const prompt = `
      당신은 직장 내 건강 안전 관리 AI입니다. 직원 ${name}의 다음 rPPG 건강 지표를 분석하세요.
      
      지표:
      - 심박수: ${metrics.heartRate} bpm
      - 호흡수: ${metrics.respirationRate} rpm
      - 산소포화도(SpO2): ${metrics.spo2}%
      - 혈압: ${metrics.bloodPressureSys}/${metrics.bloodPressureDia} mmHg
      - 스트레스 지수: ${metrics.stressLevel}/100

      일반적인 의학 지식을 바탕으로 상태가 '양호(Good)'인지 '위험(Risk)'인지 판단하세요.
      그들의 상태에 대한 한 문장 요약을 **한국어로** 제공하세요. 의학적 조언보다는 운영상의 상태 관찰 결과를 제시하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "분석 완료.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "연결 문제로 인해 AI 분석에 실패했습니다.";
  }
};