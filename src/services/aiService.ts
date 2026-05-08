import { GoogleGenAI, Type } from "@google/genai";
import { StockQuote, SentimentAnalysis, PricePrediction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeMarketSentiment = async (symbol: string, news: string[]): Promise<SentimentAnalysis> => {
  const prompt = `Analyze the sentiment for stock symbol ${symbol} based on these recent news headlines:
  ${news.join("\n")}
  
  Provide a sentiment score from -1 to 1, a label (Bullish/Bearish/Neutral), a brief explanation, and 3 key takeaways.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          label: { type: Type.STRING },
          explanation: { type: Type.STRING },
          newsSummary: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "label", "explanation", "newsSummary"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const forecastPriceAction = async (symbol: string, quote: StockQuote): Promise<PricePrediction> => {
  const prompt = `Based on the following price action for ${symbol}:
  Current: ${quote.c}
  Open: ${quote.o}
  High: ${quote.h}
  Low: ${quote.l}
  Change: ${quote.dp}%
  
  Predict the short-term direction (UP/DOWN/STEADY) and provide a confidence score (0-1) and reasoning.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          direction: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          timeframe: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        },
        required: ["direction", "confidence", "timeframe", "reasoning"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
