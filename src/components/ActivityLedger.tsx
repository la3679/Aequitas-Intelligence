import { motion } from "framer-motion";
import { Activity, ShieldAlert, Cpu, Zap, BarChart3, WifiOff } from "lucide-react";
import { MarketAlert } from "../types";

export const ActivityLedger = ({ isLive = false }: { isLive?: boolean }) => {
  const alerts: MarketAlert[] = isLive ? [
    { id: '1', symbol: 'NVDA', type: 'WHALE', severity: 'HIGH', message: 'Institutional block trade detected: $42M Order Flow', timestamp: '14:22:10' },
    { id: '2', symbol: 'BTC', type: 'VOLUME', severity: 'MEDIUM', message: 'Unusual retail participation spike (+340% over 5m)', timestamp: '14:21:45' },
  ] : [];

  return (
    <div className="flex flex-col h-full bg-bg" id="activity-ledger">
      <div className="p-6 border-b border-border bg-surface flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-accent" />
          <h1 className="text-xl font-bold tracking-tight">Intelligence Ledger</h1>
        </div>
        <div className="flex gap-2">
           <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isLive ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-ink-muted border-white/10'}`}>
             {isLive ? 'LIVE_NODES: 1,422' : 'STATUS: OFFLINE'}
           </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
        {alerts.length > 0 ? (
          alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 p-4 bg-surface border border-border rounded-lg group hover:bg-surface-elevated transition-colors"
            >
              <div className={`p-2 rounded border ${
                alert.severity === 'HIGH' ? 'bg-error/10 border-error/30 text-error' :
                alert.severity === 'MEDIUM' ? 'bg-warning/10 border-warning/30 text-warning' : 'bg-success/10 border-success/30 text-success'
              }`}>
                {alert.type === 'WHALE' ? <Zap className="w-4 h-4" /> : 
                 alert.type === 'VOLUME' ? <BarChart3 className="w-4 h-4" /> :
                 alert.type === 'TECHNICAL' ? <Cpu className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <div className="font-mono font-bold text-accent">{alert.symbol}</div>
                  <div className="text-[10px] font-mono opacity-40">{alert.timestamp} EST</div>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed group-hover:text-ink transition-colors">
                  {alert.message}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-4 opacity-40">
            <WifiOff className="w-12 h-12 text-accent" />
            <div className="text-center space-y-2">
              <div className="terminal-header italic">WAITING FOR LIVE ALPHA STREAM...</div>
              <p className="text-[10px] uppercase tracking-[0.2em]">Connect Finnhub/Polygon API keys to populate intelligence</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-surface-elevated/50 border-t border-border flex justify-center">
         <div className="terminal-header italic">
           {isLive ? 'Tailing Market-Wide Neural Flux...' : 'Neural uplink disconnected.'}
         </div>
      </div>
    </div>
  );
};
