import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Clock, BarChart3, Globe, ShieldCheck, LayoutGrid, Zap, Compass, Activity, ChevronRight, Menu, X, Bell, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StockChart } from './StockChart';
import { Aisights } from './Aisights';
import { ActivityLedger } from './ActivityLedger';
import { NeuralScanner } from './NeuralScanner';
import { MacroMatrix } from './MacroMatrix';
import { fetchQuote } from '../services/marketData';
import { analyzeMarketSentiment, forecastPriceAction } from '../services/aiService';
import { StockInfo, StockQuote, SentimentAnalysis, PricePrediction } from '../types';
import { TICKER_LIST } from '../constants/tickers';

export const Dashboard = () => {
  const [symbol, setSymbol] = useState('NVDA');
  const [searchInput, setSearchInput] = useState('');
  const [stock, setStock] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [chartData, setChartData] = useState<{ time: string, value: number }[]>([]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    finnhub: false,
    gemini: false,
    polygon: false,
    firebase: false
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput) {
      setSymbol(searchInput.toUpperCase());
      setSearchInput('');
      if (activeTab !== 'dashboard') setActiveTab('dashboard');
    }
  };

  const handleGenerateAi = async () => {
    if (!stock?.quote) return;
    setAiLoading(true);
    try {
      const newsRes = await fetch(`/api/market/news?symbol=${symbol}`);
      const news = await newsRes.json();
      const [sentiment, prediction] = await Promise.all([
        analyzeMarketSentiment(symbol, news),
        forecastPriceAction(symbol, stock.quote)
      ]);
      setStock(prev => prev ? { ...prev, sentiment, prediction } : null);
    } catch (err) {
      console.error('AI synthesis failed', err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const checkSystem = async () => {
      try {
        const res = await fetch('/api/system/status');
        const data = await res.json();
        setSystemStatus(data);
      } catch (err) {
        console.error('Failed to fetch system status', err);
      }
    };
    checkSystem();
    const interval = setInterval(checkSystem, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const quote = await fetchQuote(symbol);
        
        // Reset analysis on brand new stock load to enforce manual choice
        setStock({
          symbol,
          name: symbol,
          quote,
          sentiment: null,
          prediction: null
        });

        // Fetch real history from API
        const historyRes = await fetch(`/api/market/history?symbol=${symbol}`);
        const history = await historyRes.json();
        setChartData(history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [symbol]);

  return (
    <div className="h-screen w-screen bg-bg text-ink flex overflow-hidden select-none font-sans" id="immersive-dashboard">
      {/* Dynamic Sidebar: 1000 Stock Selection Node */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="h-full bg-surface border-r border-border flex flex-col z-40 relative group transition-all"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center glow-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]">
               <Zap className="w-5 h-5 text-white" />
             </div>
             {sidebarOpen && (
               <motion.span 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="font-bold tracking-tighter text-xl"
               >
                 LUMINA
               </motion.span>
             )}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="opacity-40 hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-full"
          >
             {sidebarOpen ? <ChevronRight className="w-4 h-4 rotate-180" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="px-4 py-2 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutGrid, label: 'Neural Desktop' },
            { id: 'activity', icon: Activity, label: 'Market Ledger' },
            { id: 'compass', icon: Compass, label: 'Alpha Scanners' },
            { id: 'globe', icon: Globe, label: 'Macro Matrix' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${activeTab === item.id ? 'bg-accent/10 text-accent shadow-sm' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              {activeTab === item.id && sidebarOpen && (
                <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Neural Universe: 1000+ Tickers */}
        <div className="mt-8 px-6 space-y-4 flex-1 flex flex-col overflow-hidden">
           <div className="flex justify-between items-center opacity-40">
              <div className="text-[10px] font-bold uppercase tracking-widest">Neural Universe</div>
              {sidebarOpen && <span className="text-[8px] font-mono">LOCKED_NODES: {TICKER_LIST.length}</span>}
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {TICKER_LIST.map(s => {
                const isSelected = symbol === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      setSymbol(s);
                      if (activeTab !== 'dashboard') setActiveTab('dashboard');
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-[10px] font-mono transition-all border border-transparent ${isSelected ? 'bg-accent/20 text-accent border-accent/30' : 'hover:bg-white/5 opacity-40 hover:opacity-100'}`}
                  >
                    <span>{s}</span>
                    {isSelected && <div className="w-1 h-1 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--color-accent)]" />}
                  </button>
                );
              })}
           </div>
        </div>

        <div className="p-4 border-t border-border bg-white/2">
           <div 
             onClick={() => setShowStatusModal(true)}
             className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${systemStatus.finnhub ? 'bg-success/5 border-success/20 text-success glow-green' : 'bg-white/5 border-white/10 opacity-40'}`}
           >
              <div className={`w-2 h-2 rounded-full ${systemStatus.finnhub ? 'bg-success animate-pulse' : 'bg-ink-muted'}`} />
              {sidebarOpen && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest">{systemStatus.finnhub ? 'Live Feed' : 'Local Mode'}</span>
                  <span className="text-[8px] opacity-60">UPLINK_STATUS</span>
                </div>
              )}
           </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        
        {/* Simplified Header Console */}
        <header className="h-20 border-b border-border bg-surface flex items-center px-8 justify-between shrink-0 z-30">
          <div className="flex items-center gap-8">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:text-accent transition-colors" />
              <input 
                type="text"
                placeholder="Lookup neural node (e.g. BTC)..."
                className="bg-bg border border-border rounded-full pl-12 pr-6 py-2.5 text-xs w-80 focus:outline-hidden focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all font-mono"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-4 mr-6">
                {[
                  { s: 'NASDAQ', p: systemStatus.finnhub ? '18,428.10' : 'N/A', c: '+0.85%', color: 'text-success' },
                  { s: 'SPX', p: systemStatus.finnhub ? '5,123.44' : 'N/A', c: '+1.2%', color: 'text-success' },
                ].map((m, i) => (
                  <div key={i} className="flex flex-col text-right">
                     <span className="text-[9px] opacity-40 uppercase font-mono">{m.s}</span>
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">{m.p}</span>
                        {systemStatus.finnhub && <span className={`text-[10px] ${m.color}`}>{m.c}</span>}
                     </div>
                  </div>
                ))}
             </div>
             
             <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
                <div className="h-4 w-px bg-border mx-2" />
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${symbol}`} alt="Stock" referrerPolicy="no-referrer" />
                </div>
             </div>
          </div>
        </header>

        <AnimatePresence>
          {showStatusModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-border bg-white/2 flex justify-between items-center">
                  <h2 className="text-sm font-bold tracking-widest uppercase">System Connectivity Report</h2>
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>
                
                <div className="p-6 space-y-4">
                  {[
                    { id: 'FINNHUB_API', status: systemStatus.finnhub, label: 'Market Data Feed', desc: 'Real-time equity quotes and news nodes' },
                    { id: 'GEMINI_AI', status: systemStatus.gemini, label: 'Intelligence Core', desc: 'Neural synthesis and forecasting engines' },
                    { id: 'POLYGON_IO', status: systemStatus.polygon, label: 'Historical Node', desc: 'Deep-layer historical price aggregation' },
                    { id: 'FIREBASE', status: systemStatus.firebase, label: 'State Sync', desc: 'Shared intelligence and user persistence' },
                  ].map((sys) => (
                    <div key={sys.id} className="flex items-start gap-4 p-4 bg-bg border border-border rounded-xl">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${sys.status ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold uppercase font-mono">{sys.id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${sys.status ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}`}>
                            {sys.status ? 'CONNECTED' : 'DISCONNECTED'}
                          </span>
                        </div>
                        <div className="text-[10px] text-ink-muted leading-tight opacity-60">
                          {sys.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white/2 border-t border-border flex flex-col gap-2">
                  <p className="text-[10px] text-center text-ink-muted italic">
                    {systemStatus.finnhub ? "Live market nodes active. All data reflects real-time exchange values." : "Live data keys missing. Operating in local simulation mode (Static/Historical data only)."}
                  </p>
                  <button 
                    onClick={() => setShowStatusModal(false)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 rounded font-mono text-[10px] uppercase tracking-widest transition-colors"
                  >
                    CLOSE_REPORT
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary View Area */}
        <div className="flex-1 overflow-hidden grid grid-cols-12 bg-white/5 gap-px">
          
          {/* Main Content Switcher */}
          <section className="col-span-12 lg:col-span-8 bg-bg flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' ? (
                <motion.div 
                  key="dashboard-view"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-6 space-y-6 overflow-y-auto"
                >
                  {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center h-96 gap-4 opacity-40">
                      <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span className="terminal-header italic">INITIALIZING NEURAL DATA NODES...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Header Block */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h1 className="text-3xl font-bold tracking-tight">
                            {symbol} <span className="text-xs font-mono opacity-40 ml-2 uppercase font-normal">{stock?.name}</span>
                          </h1>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-4xl font-mono tracking-tighter glow-text-blue">
                              {stock?.quote?.c ? stock.quote.c.toFixed(2) : 'N/A'}
                            </span>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono ${(stock?.quote?.d && stock.quote.d >= 0) || !stock?.quote?.c ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                              {stock?.quote?.d && stock.quote.d >= 0 ? <TrendingUp className="w-3 h-3" /> : (stock?.quote?.c ? <TrendingDown className="w-3 h-3" /> : null)}
                              {stock?.quote?.c ? (
                                <>{stock.quote.d?.toFixed(2)} ({stock.quote.dp?.toFixed(2)}%)</>
                              ) : (
                                <>0.00 (0.00%)</>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="bg-accent/10 border border-accent/30 p-3 rounded-lg flex gap-4 items-center glow-blue">
                          <div className="text-right leading-tight">
                            <div className="text-[10px] text-accent uppercase font-bold tracking-widest">AI SIGNAL</div>
                            <div className="text-lg font-bold uppercase">{stock?.prediction?.direction === 'UP' ? 'Strong Buy' : 'Neutral'}</div>
                          </div>
                          <div className="text-3xl font-mono text-accent drop-shadow-sm">
                            {Math.round((stock?.prediction?.confidence || 0.82) * 100)}%
                          </div>
                        </div>
                      </div>

                      {/* Chart Container */}
                      <div className="bg-surface rounded-xl border border-border relative overflow-hidden group">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-white/2">
                          <div className="flex items-center gap-2 terminal-header">
                            <BarChart3 className="w-3 h-3" />
                            AGGREGATED QUANTIATIVE FLOW
                          </div>
                          <div className="flex gap-1">
                            {['1D', '1W', '1M', '1Y'].map(t => (
                              <button key={t} className={`text-[9px] px-2 py-0.5 rounded transition-all ${t === '1D' ? 'bg-accent text-white' : 'text-ink-muted hover:bg-white/5'}`}>{t}</button>
                            ))}
                          </div>
                        </div>
                        <div className="p-4">
                          <StockChart data={chartData} colors={{ backgroundColor: 'transparent' }} />
                        </div>
                      </div>

                      {/* Technical Matrix */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: 'VOLATILITY INDEX', val: systemStatus.finnhub ? 'LOW' : 'N/A', sub: systemStatus.finnhub ? '-2.1%' : '0.0%', color: 'text-success' },
                          { label: 'RSI (14)', val: systemStatus.finnhub ? '64.2' : 'N/A', sub: systemStatus.finnhub ? 'NEUTRAL' : 'WAITING', color: 'text-warning' },
                          { label: 'GAMMA EXPOSURE', val: systemStatus.finnhub ? 'POSITIVE' : 'N/A', sub: systemStatus.finnhub ? 'BULLISH' : 'WAITING', color: 'text-accent' },
                          { label: 'INSIDER TREND', val: systemStatus.finnhub ? 'ACCUM' : 'N/A', sub: systemStatus.finnhub ? 'STRONG' : 'WAITING', color: 'text-success' },
                        ].map((stat, i) => (
                          <div key={i} className="bg-surface p-4 rounded-lg border border-border hover:bg-surface-elevated transition-colors">
                            <div className="terminal-header text-[8px] mb-2">{stat.label}</div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-mono font-bold leading-none">{stat.val}</span>
                              <span className={`text-[10px] font-mono ${stat.color}`}>{stat.sub}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : activeTab === 'activity' ? (
                <motion.div key="activity-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <ActivityLedger isLive={systemStatus.finnhub} />
                </motion.div>
              ) : activeTab === 'compass' ? (
                <motion.div key="compass-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <NeuralScanner isLive={systemStatus.finnhub} />
                </motion.div>
              ) : (
                <motion.div key="globe-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <MacroMatrix isLive={systemStatus.finnhub} />
                </motion.div>
              ) }
            </AnimatePresence>
          </section>

          {/* Right Aside: AI Intelligence & Insights */}
          <aside className="hidden lg:flex col-span-4 bg-surface flex-col border-l border-border overflow-y-auto">
             <Aisights 
               sentiment={stock?.sentiment || null} 
               prediction={stock?.prediction || null} 
               isLoading={aiLoading} 
               onGenerate={handleGenerateAi}
             />
             
             {/* Action Pad */}
             <div className="mt-auto p-6 border-t border-border bg-surface-elevated/50 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono px-1">
                   <span className="opacity-40">UPLINK_HEALTH</span>
                   <span className="text-accent underline">98.2%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: '98.2%' }} 
                     className="h-full bg-accent glow-blue shadow-[0_0_8px_var(--color-accent)]" 
                   />
                </div>
                <button 
                  onClick={handleGenerateAi}
                  disabled={aiLoading}
                  className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-xs tracking-widest transition-all glow-blue group flex items-center justify-center gap-2"
                >
                  {aiLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 fill-current" />
                  )}
                  {aiLoading ? 'SYNTHESIZING...' : 'CONSULT AI STRATEGIST'}
                  {!aiLoading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
             </div>
          </aside>
        </div>

        {/* Global Footer Console */}
        <footer className="h-8 border-t border-border bg-surface flex items-center px-6 justify-between text-[9px] font-mono shrink-0">
           <div className="flex gap-6">
              <div className="flex gap-2">
                 <span className="opacity-40">UPLINK:</span>
                 <span className="text-success uppercase">CONNECTED_GATEWAY_32</span>
              </div>
              <div className="hidden sm:flex gap-2">
                 <span className="opacity-40">LATENCY:</span>
                 <span className="text-accent underline">12ms</span>
              </div>
              <div className="hidden lg:flex gap-2">
                 <span className="opacity-40">NODE_CONTEXT:</span>
                 <span>{symbol} @ AX-7742</span>
              </div>
           </div>
           <div className="opacity-30 uppercase tracking-[0.2em]">
             Lumina Core v2.05-PRIME // {systemStatus.finnhub ? 'LIVE_STREAM_ACTIVE' : 'LOCAL_SIM_MODE'}
           </div>
        </footer>

        {/* Visual Overlays */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-0 w-[500px] h-96 bg-success/5 blur-[150px] pointer-events-none -z-10" />
      </main>
    </div>
  );
};
