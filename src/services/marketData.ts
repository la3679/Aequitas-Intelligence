import { StockQuote } from "../types";

const API_BASE = "/api/market";

export const fetchQuote = async (symbol: string): Promise<StockQuote> => {
  const response = await fetch(`${API_BASE}/quote?symbol=${symbol}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch quote");
  }
  return response.json();
};

export class MarketStream {
  private socket: WebSocket | null = null;
  private listeners: Map<string, (data: any) => void> = new Map();

  connect() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    this.socket = new WebSocket(`${protocol}//${window.location.host}`);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "QUOTE" && this.listeners.has(data.symbol)) {
        this.listeners.get(data.symbol)!(data);
      }
    };

    this.socket.onopen = () => console.log("Market Stream Connected");
    this.socket.onclose = () => console.log("Market Stream Disconnected");
  }

  subscribe(symbol: string, callback: (data: any) => void) {
    this.listeners.set(symbol, callback);
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "SUBSCRIBE", symbol }));
    }
  }

  unsubscribe(symbol: string) {
    this.listeners.delete(symbol);
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "UNSUBSCRIBE", symbol }));
    }
  }

  close() {
    this.socket?.close();
  }
}

export const marketStream = new MarketStream();
