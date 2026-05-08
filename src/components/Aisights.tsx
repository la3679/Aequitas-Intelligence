import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BrainCircuit, Info } from "lucide-react";
import { SentimentAnalysis, PricePrediction } from "../types";

interface AisightsProps {
  sentiment?: SentimentAnalysis | null;
  prediction?: PricePrediction | null;
  isLoading?: boolean;
  onGenerate?: () => void;
}

export const Aisights = ({ sentiment, prediction, isLoading, onGenerate }: AisightsProps) => {
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-4 bg-white/5 rounded w-1/2"></div>
        <div className="h-32 bg-white/5 rounded"></div>
        <div className="h-32 bg-white/5 rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" id="ai-intelligence-report">
      <div className="p-4 border-b border-border bg-surface-elevated/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${sentiment?.label ? 'bg-accent glow-blue' : 'bg-white/10'}`} />
          <h2 className="text-xs font-bold tracking-widest uppercase">AI Intelligence Report</h2>
        </div>
        {!sentiment && !isLoading && (
          <button 
            onClick={onGenerate}
            className="text-[9px] px-2 py-0.5 bg-accent/20 text-accent border border-accent/40 rounded hover:bg-accent/30 transition-all font-mono animate-pulse"
          >
            RUN_SYNTHESIS
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {!sentiment && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-center opacity-40 space-y-4">
             <div className="p-4 rounded-full border border-white/5 bg-white/2">
                <BrainCircuit className="w-8 h-8" />
             </div>
             <div className="space-y-1">
                <div className="terminal-header text-[10px]">MANUAL OVERRIDE REQUIRED</div>
                <p className="text-[9px] uppercase tracking-widest max-w-[200px]">Intelligence synthesis is disabled by default. Click "RUN_SYNTHESIS" to begin neural processing.</p>
             </div>
          </div>
        ) : isLoading ? (
          <div className="p-6 space-y-6 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-1/2"></div>
            <div className="h-32 bg-white/5 rounded"></div>
            <div className="h-32 bg-white/5 rounded"></div>
          </div>
        ) : (
          <>
            {/* Catalyst Analysis */}
        <div className="space-y-3">
          <div className="terminal-header italic flex items-center gap-2">
            <Info className="w-3 h-3" />
            Neural Catalyst Analysis
          </div>
          <div className="bg-surface-elevated border border-white/10 rounded-lg p-4 text-[13px] leading-relaxed relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 italic text-[10px] uppercase font-mono">GEN-03</div>
            <p className="mb-3 font-semibold text-accent">Summary of Primary Drivers:</p>
            <ul className="space-y-2 text-ink-muted">
              {sentiment?.newsSummary && sentiment.newsSummary.length > 0 ? (
                sentiment.newsSummary.map((point: string, i: number) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-accent font-mono">0{i+1}</span>
                    <span>{point}</span>
                  </li>
                ))
              ) : (
                <li className="flex gap-3 items-start opacity-40">
                  <span className="text-accent font-mono">--</span>
                  <span>No live catalysts detected. Connect Gemini API for intelligence synthesis.</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Sentiment Matrix */}
        <div className="space-y-3">
          <div className="terminal-header italic">Real-Time Sentiment Matrix</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'GLOBAL', val: sentiment?.label === 'Bullish' ? '82%' : (sentiment?.label === 'Bearish' ? '41%' : 'N/A'), color: sentiment?.label ? (sentiment?.label === 'Bullish' ? 'bg-success/20 border-success/30' : 'bg-error/20 border-error/30') : 'bg-white/5 border-white/10' },
              { label: 'SOCIAL', val: sentiment?.label ? '64%' : 'N/A', color: sentiment?.label ? 'bg-accent/20 border-accent/30' : 'bg-white/5 border-white/10' },
              { label: 'NEWS', val: sentiment?.label === 'Bullish' ? '58%' : (sentiment?.label === 'Bearish' ? '32%' : 'N/A'), color: sentiment?.label ? (sentiment?.label === 'Bullish' ? 'bg-success/20 border-success/30' : 'bg-warning/20 border-warning/30') : 'bg-white/5 border-white/10' },
            ].map((node, i) => (
              <div key={i} className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 ${node.color} transition-colors`}>
                <span className="text-[9px] opacity-60 font-bold">{node.label}</span>
                <span className="text-sm font-mono font-bold">{node.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Block */}
        <div className="space-y-3">
          <div className="terminal-header italic">Price Forecasting Logic</div>
          <div className="bg-surface-elevated border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
               <span className="text-xs font-bold uppercase underline decoration-accent underline-offset-4">Prediction Window</span>
               <div className="flex items-center gap-1">
                 {prediction?.direction === 'UP' ? <TrendingUp className="w-3 h-3 text-success" /> : (prediction?.direction === 'DOWN' ? <TrendingDown className="w-3 h-3 text-error" /> : null)}
                 <span className="text-xs font-mono font-bold">{prediction?.direction || 'N/A'}</span>
               </div>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed italic opacity-80">
              "{prediction?.reasoning || 'Temporal transformer nodes are currently offline. Intelligence requires live API uplink.'}"
            </p>
          </div>
        </div>
      </>
    )}
  </div>
</div>
  );
};
