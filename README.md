# Lumina Intelligence Terminal

Lumina is a high-performance financial intelligence platform designed for real-time market synthesis and advanced predictive analytics. It provides traders and analysts with a neural-themed dashboard to track thousands of equity nodes, analyze global sentiment, and visualize complex market correlations.

## 🚀 Core Features

### 1. Neural Universe
- **Extensive Coverage**: Track over 1,000+ stock symbols and high-market-cap assets.
- **Dynamic Selection**: High-speed sidebar navigation for seamless switching between neural nodes.

### 2. AI Intelligence Synthesis
- **Deep-Layer Reports**: On-demand market intelligence reports powered by neural transformer models.
- **Sentiment Matrix**: Real-time analysis of global catalysts, social signals, and news drivers.
- **Price Action Forecasting**: Algorithmic prediction windows with detailed reasoning engines.

### 3. High-Fidelity Visualization
- **Real-Time Charts**: Integrated high-performance price action charts with sub-second resolution.
- **Neural UI**: A custom-crafted, immersive terminal interface optimized for focus and data density.

### 4. Alpha Scanner & Macro Matrix
- **Momentum Detection**: Scans for institutional accumulation and volatility compression cycles.
- **Global Correlations**: Monitor the S&P 500, NASDAQ, Gold, and Forex pairs within a single macro-structural view.

### 5. Secure Uplink Architecture
- **Hybrid Backend**: Express.js server-side processing to securely handle financial API integrations.
- **Live Feed System**: Direct integration with Finnhub and Gemini AI for live market data and intelligence synthesis.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion (Animations).
- **Charts**: Lightweight Charts (Financial Visualization).
- **Backend**: Node.js, Express.js.
- **Intelligence**: Google Gemini AI (LLM Synthesis).
- **Market Data**: Finnhub Stock API.

## ⚙️ Configuration

The terminal requires active API uplinks to function in live mode. Configure your environment variables in a `.env` file:

```env
# Financial Data Provider
FINNHUB_API_KEY=your_finnhub_key_here

# Intelligence Synthesis Engine
GEMINI_API_KEY=your_gemini_key_here
```

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development terminal**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## 🏗 Architecture Documentation

### Logic flow
1. **Selection**: User selects a ticker from the "Neural Universe" sidebar.
2. **Ingestion**: The terminal initiates a server-side handshake via `/api/market/quote` and `/api/market/history`.
3. **Synthesis**: When manually triggered, the "Consult AI Strategist" sub-routine aggregates recent news headlines and quote data to generate a comprehensive intelligence report.
4. **Visualization**: Real-time data is piped into the Lightweight Charts instance while AI insights populate the neural report pane.

## 🔐 Security & Integrity

- **API Shielding**: All third-party API keys are strictly managed server-side.
- **Data sanitization**: Incoming market data is validated to prevent temporal fusion errors or visualization breaks.

---
*Lumina Core v2.05-PRIME*
