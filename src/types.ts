export interface StockQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
  t: number; // Timestamp
}

export interface StockInfo {
  symbol: string;
  name: string;
  quote?: StockQuote;
  sentiment?: SentimentAnalysis;
  prediction?: PricePrediction;
}

export interface SentimentAnalysis {
  score: number; // -1 to 1
  label: "Bullish" | "Bearish" | "Neutral";
  explanation: string;
  newsSummary: string[];
}

export interface PricePrediction {
  direction: "UP" | "DOWN" | "STEADY";
  confidence: number; // 0 to 1
  timeframe: string;
  reasoning: string;
}

export interface MarketAlert {
  id: string;
  symbol: string;
  type: 'VOLUME' | 'WHALE' | 'NEWS' | 'SENTIMENT' | 'TECHNICAL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  timestamp: string;
}

export interface MacroData {
  index: string;
  value: string;
  change: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  watchlist: string[];
}
