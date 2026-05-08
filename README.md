# Lumina Global Intelligence Terminal

Lumina is a next-generation high-performance financial intelligence platform designed for real-time market synthesis and advanced predictive analytics. Developed for analysts who require sub-second latency and deep-layer data intelligence, Lumina provides an immersive, neural-themed environment to track the "Neural Universe"—a cluster of over 1,000+ equity nodes and digital assets.

## 🚀 Vision & Philosophy

Lumina was engineered to solve the "data density" problem in modern trading. Instead of clunky, generic interfaces, Lumina utilizes a custom **Neural UI** system that prioritizes cognitive focus through:
- **Obsidian Dark Theme**: Reduced eye strain during extended analytical sessions.
- **Atmospheric Glow States**: Visual cues for market volatility and system status.
- **Context-Aware Navigation**: A 1,000+ node selection rail optimized for speed.

---

## 💎 Core Feature Set

### 1. The Neural Universe (Selection Engine)
- **High-Capacity Rail**: A dynamically rendered sidebar housing 1,000+ liquid tickers across Equities, Crypto, and ETFs.
- **Node Syncing**: Instant state synchronization between selection and the visualization engine.

### 2. Intelligent Synthesis (AISights)
- **Manual neural processing**: Intelligence reports are not "pushed" to the user, but "pulled" via the `RUN_SYNTHESIS` directive, ensuring focused analysis.
- **Catalyst Analysis**: Identifies fundamental drivers and institutional flow signals.
- **Temporal Forecasting**: Probabilistic price action modeling based on recent catalyst aggregation.

### 3. Precision Market Visualization
- **Lightweight Charts™**: High-performance financial charts capable of handling thousands of data points with smooth zooming and panning.
- **Hybrid Data Layers**: Combines server-side quote data with cached historical nodes for a complete timeline view.

### 4. Alpha Scanners & Matrix Nodes
- **Neural Scanner**: Real-time momentum detection using volatility compression signals.
- **Macro Matrix**: A high-level view of global correlations (NASDAQ, SPX, DXY) integrated directly into the workspace.

---

## 🛠 Project Architecture

Lumina utilizes a modern hybrid architecture to ensure maximum performance and security.

### System Directory Structure
```text
├── server.ts              # High-security Node/Express API Proxy & Static Server
├── src/
│   ├── components/        # Specialized analytical modules
│   │   ├── Aisights.tsx   # Intelligence synthesis engine
│   │   ├── StockChart.tsx # Lightweight Chart integration
│   │   ├── Dashboard.tsx  # Central neural desktop
│   │   └── ...            # Specialized scanner & matrix nodes
│   ├── services/          # Data ingestion & Intelligence services
│   │   ├── marketData.ts  # Financial API mapping
│   │   └── aiService.ts   # Advanced neural synthesis logic
│   ├── constants/         # Static node definitions (1,000+ tickers)
│   ├── lib/               # Utility toolbelt
│   └── types.ts           # Global interface definitions
├── public/                # Static assets & environment entry points
└── package.json           # Module registry
```

### Data Flow Model
1. **Request Initiation**: Client-side triggers a handshake with the Lumina Backend.
2. **Secure Proxying**: The Express.js backend provides a secure uplink to `Finnhub` and `Neural Transformer` APIs, shielding sensitive keys.
3. **Data Hydration**: Incoming raw bytes are transformed into typed schemas and piped into the state machine.
4. **Rendering**: Framer Motion and Optimized React renders update the UI at 60fps.

---

## ⚙️ Deployment & Configuration

### Environment Setup
Lumina requires active uplinks for live mode. Create a `.env` file in the root directory:

```env
# Financial Data Provider (Finnhub.io)
FINNHUB_API_KEY=your_secured_key

# Intelligence Synthesis Engine (Neural Gateway)
GEMINI_API_KEY=your_secured_key
```

### Installation
```bash
# 1. Clone the core
git clone <repository-url>

# 2. Ingest dependencies
npm install

# 3. Boot development terminal
npm run dev
```

---

## 📈 Future Roadmap

- [ ] **Multi-Screen Support**: Detachable workspaces for multi-monitor setups.
- [ ] **Custom Node Scripting**: Allow users to write their own momentum triggers.
- [ ] **Social Synchronization**: Shared "Neural Channels" for collaborative research.
- [ ] **Deep Archive Access**: 10+ years of historical data nodes.

## 🔐 Security & Integrity

- **Zero-Exposure Keys**: Frontend never touches API keys. All calls are proxied through a hardened server layer.
- **Schema Validation**: Comprehensive Zod/TypeScript validation for all incoming financial data.
- **Sanitized UI**: No mock data or simulated "smoke and mirrors"—if the uplink is down, the system enters a safe standby mode.

---
*Lumina Intelligence Systems // Core v2.05-PRIME*

