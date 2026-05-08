import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  // Simple WebSocket integration for market data proxying
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");
    
    // Example: Forward message from finnhub or internal source
    // For now, just heartbeats and simple echo
    ws.on("message", (message) => {
      console.log(`Received message: ${message}`);
    });

    ws.send(JSON.stringify({ type: "INIT", message: "Connected to Aequitas Data Feed" }));
  });

  // API Routes
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/system/status", (req, res) => {
    res.json({
      finnhub: !!process.env.FINNHUB_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      polygon: !!process.env.POLYGON_API_KEY,
      alphavantage: !!process.env.ALPHAVANTAGE_API_KEY,
      firebase: !!process.env.FIREBASE_PROJECT_ID || !!process.env.VITE_FIREBASE_API_KEY, // basic check
      timestamp: Date.now()
    });
  });

  // Proxy for Finnhub/Polygon to protect keys
  app.get("/api/market/quote", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
    if (!FINNHUB_API_KEY) {
      // User requested 0 or N/A for data not generated from live.
      // We will return a structure that the frontend handles as "Live Data Missing"
      return res.json({
        c: 0,
        d: 0,
        dp: 0,
        h: 0,
        l: 0,
        o: 0,
        pc: 0,
        t: Math.floor(Date.now()/1000),
        isLive: false // Custom flag to indicate this is not live
      });
    }

    try {
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  app.get("/api/market/history", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
    if (!FINNHUB_API_KEY) {
      return res.json([]); // Return empty list instead of mock data
    }

    try {
      // Fetch daily candles for the last 30 days
      const to = Math.floor(Date.now() / 1000);
      const from = to - (30 * 24 * 60 * 60);
      const response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`);
      const data = await response.json();
      
      if (data.s === "ok") {
        const history = data.t.map((time: number, i: number) => ({
          time: new Date(time * 1000).toISOString(),
          value: data.c[i]
        }));
        return res.json(history);
      }
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market history" });
    }
  });

  app.get("/api/market/news", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
    if (!FINNHUB_API_KEY) {
      return res.json([]);
    }

    try {
      const today = new Date().toISOString().split("T")[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const response = await fetch(
        `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${weekAgo}&to=${today}&token=${FINNHUB_API_KEY}`
      );
      const data = await response.json();
      const headlines = Array.isArray(data) ? data.slice(0, 5).map((n: any) => n.headline) : [];
      res.json(headlines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market news" });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
