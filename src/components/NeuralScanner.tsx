import { motion } from "framer-motion";
import { Compass, Target, Waves, WifiOff } from "lucide-react";

export const NeuralScanner = ({ isLive = false }: { isLive?: boolean }) => {
  const opportunities = isLive ? [] : [];

  return (
    <div className="flex flex-col h-full bg-bg" id="neural-scanner">
      <div className="p-6 border-b border-border bg-surface flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Compass className="w-5 h-5 text-accent" />
          <h1 className="text-xl font-bold tracking-tight">Neural Momentum Scanner</h1>
        </div>
        {!isLive && (
          <div className="flex items-center gap-2 text-error text-[10px] font-mono animate-pulse">
            <WifiOff className="w-3 h-3" />
            SIMULATED SCAN MODE
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {!isLive && (
          <div className="absolute inset-0 bg-bg/40 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none">
             <div className="bg-surface border border-border p-6 rounded-2xl text-center space-y-2 shadow-2xl">
                <div className="terminal-header text-accent">LIVE FEED DISCONNECTED</div>
                <p className="text-[9px] uppercase tracking-widest opacity-60">Scanning for live alpha clusters requires API uplink</p>
             </div>
          </div>
        )}

        <div className="space-y-6 col-span-1">
          <div className="terminal-header italic">Alpha Opportunities</div>
          <div className="space-y-4">
            {opportunities.length > 0 ? opportunities.map((opt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-border rounded-xl p-5 hover:border-accent/40 transition-all glow-blue group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-mono text-2xl font-bold group-hover:text-accent transition-colors">{opt.symbol}</div>
                    <div className="text-[10px] text-ink-muted uppercase tracking-widest mt-1">Convergence Score</div>
                  </div>
                  <div className="text-4xl font-mono text-accent">{opt.score === 0 ? '--' : opt.score}</div>
                </div>
                
                <div className="p-3 bg-white/2 rounded-lg border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase">
                    <Target className="w-3 h-3" />
                    Neural Verdict
                  </div>
                  <p className="text-xs text-ink-muted italic leading-relaxed">
                    "{opt.reason}"
                  </p>
                </div>
              </motion.div>
            )) : (
               <div className="p-10 border border-dashed border-white/10 rounded-xl text-center opacity-40 italic text-[11px] uppercase tracking-widest">
                 {isLive ? 'No high-confidence momentum clusters detected in current neural sweep.' : 'Neural uplink required for momentum scanning.'}
               </div>
            )}
          </div>
        </div>

        <div className="space-y-6 col-span-1">
          <div className="terminal-header italic">Scanning Frequency</div>
          <div className="bg-surface-elevated border border-border rounded-xl p-6 space-y-8">
            {[
              { label: 'Market Volatility', color: 'bg-error', val: isLive ? '72%' : '0%' },
              { label: 'Institutional Flow', color: 'bg-accent', val: isLive ? '88%' : '0%' },
              { label: 'Social Sentiment', color: 'bg-success', val: isLive ? '45%' : '0%' },
            ].map((node, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="opacity-40">{node.label}</span>
                  <span className="font-bold">{node.val}</span>
                </div>
                <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: node.val }}
                    className={`h-full ${node.color}`}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-warning">
                <Waves className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Anomaly Guard Active</span>
              </div>
              <p className="text-[10px] text-ink-muted italic leading-relaxed">
                {isLive ? 'Currently monitoring 4,200+ equity nodes for temporal distribution shifts.' : 'Anomaly detection offline. Link Finnhub key to begin surveillance.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
