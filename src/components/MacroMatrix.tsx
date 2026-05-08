import { motion } from "framer-motion";
import { Globe, TrendingUp, TrendingDown, Info, WifiOff } from "lucide-react";

export const MacroMatrix = ({ isLive = false }: { isLive?: boolean }) => {
  const indices = [
    { s: 'S&P 500', p: 'N/A', c: '0.00%', trend: 'NONE' },
    { s: 'NASDAQ 100', p: 'N/A', c: '0.00%', trend: 'NONE' },
    { s: 'FTSE 100', p: 'N/A', c: '0.00%', trend: 'NONE' },
    { s: 'NIKKEI 225', p: 'N/A', c: '0.00%', trend: 'NONE' },
    { s: 'EUR/USD', p: 'N/A', c: '0.00%', trend: 'NONE' },
    { s: 'GOLD (OZ)', p: 'N/A', c: '0.00%', trend: 'NONE' },
  ];

  return (
    <div className="flex flex-col h-full bg-bg" id="macro-matrix">
      <div className="p-6 border-b border-border bg-surface flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-accent" />
          <h1 className="text-xl font-bold tracking-tight">Macro Sentiment Matrix</h1>
        </div>
        <div className={`text-[10px] font-mono flex items-center gap-2 ${isLive ? 'text-success' : 'text-error'}`}>
          {!isLive && <WifiOff className="w-3 h-3" />}
          {isLive ? 'SYNC_STATUS: NOMINAL (LAT: 08ms)' : 'SYNC_STATUS: DISCONNECTED'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {indices.map((index, i) => (
            <motion.div
              key={index.s}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface border border-border p-5 rounded-xl flex justify-between group hover:bg-surface-elevated transition-colors"
            >
              <div>
                <div className="text-[10px] text-ink-muted uppercase font-bold tracking-widest">{index.s}</div>
                <div className="text-xl font-mono mt-1 group-hover:text-ink transition-colors">{index.p}</div>
              </div>
              <div className="text-right flex flex-col items-end justify-between">
                <div className={`text-xs font-mono font-bold ${index.trend === 'UP' ? 'text-success' : 'text-error'}`}>
                  {index.c}
                </div>
                {index.trend === 'UP' ? <TrendingUp className="w-4 h-4 text-success" /> : <TrendingDown className="w-4 h-4 text-error" />}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface/50 border border-border rounded-xl p-6 space-y-4">
            <div className="terminal-header italic flex items-center gap-2">
              <Info className="w-3 h-3" />
              Neural Macro Analysis
            </div>
            <div className="text-[13px] text-ink-muted leading-relaxed space-y-4">
              <p>
                {isLive ? (
                   <>Detailed macro divergence reports and correlation heatmaps require deep-layer API aggregation. Initializing sub-routine...</>
                ) : (
                  <>Connect global market APIs to generate macro-structural divergence reports and correlation heatmaps.</>
                )}
              </p>
              {isLive && (
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                    <span>Currency hedging activity peaking in JPY-denominated nodes.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                    <span>Energy sentiment shifting following OPEC+ spectral guidance analysis.</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div className="bg-surface-elevated border border-white/5 rounded-xl p-6 flex flex-col justify-center items-center gap-4 text-center">
             <div className={`w-24 h-24 rounded-full border-4 ${isLive ? 'border-accent/20 border-t-accent animate-spin-slow' : 'border-white/5'} flex items-center justify-center`}>
                <div className="text-2xl font-mono font-bold text-accent">--</div>
             </div>
             <div>
                <div className="terminal-header">Global Greed Index</div>
                <div className="text-sm font-bold mt-1 text-accent uppercase tracking-[0.3em]">
                  {isLive ? 'Status: CALIBRATING...' : 'Status: Offline'}
                </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};
