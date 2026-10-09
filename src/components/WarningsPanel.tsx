import React from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { CodeWarning } from '../types';

interface WarningsPanelProps {
  warnings: CodeWarning[];
  onJumpToLine: (line: number) => void;
  onApplyFix?: (warning: CodeWarning) => void;
}

export const WarningsPanel: React.FC<WarningsPanelProps> = ({
  warnings,
  onJumpToLine
}) => {
  const critical = warnings.filter(w => w.severity === 'critical');
  const warningLevel = warnings.filter(w => w.severity === 'warning');
  const todos = warnings.filter(w => w.severity === 'todo');
  const infos = warnings.filter(w => w.severity === 'info');

  if (warnings.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-200">Zero Warnings Detected</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          This code passed all security, quality, syntax, and bracket balance checks cleanly.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header Summary */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Warning Diagnostic Inspector ({warnings.length})
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          {critical.length > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {critical.length} Critical
            </span>
          )}
          {warningLevel.length > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {warningLevel.length} Warning
            </span>
          )}
          {todos.length > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {todos.length} Todo
            </span>
          )}
        </div>
      </div>

      {/* Warnings List */}
      <div className="space-y-2.5">
        {warnings.map((w) => {
          let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
          let icon = <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />;

          if (w.severity === 'critical') {
            badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            icon = <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />;
          } else if (w.severity === 'warning') {
            badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            icon = <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
          } else if (w.severity === 'todo') {
            badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            icon = <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />;
          }

          return (
            <div
              key={w.id}
              className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {icon}
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${badgeColor}`}>
                    {w.rule}
                  </span>
                </div>
                <button
                  onClick={() => onJumpToLine(w.line)}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-mono transition-colors"
                >
                  <span>Line {w.line}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {w.message}
              </p>

              {w.suggestion && (
                <div className="bg-slate-950/70 p-2 rounded text-[11px] text-slate-400 border border-slate-800/80 flex items-start gap-1.5">
                  <span className="text-indigo-400 font-semibold shrink-0">Advice:</span>
                  <span>{w.suggestion}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
