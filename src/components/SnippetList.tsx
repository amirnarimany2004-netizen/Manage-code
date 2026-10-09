import React from 'react';
import { 
  Star, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  Copy, 
  FileCode2,
  Check
} from 'lucide-react';
import { CodeSnippet } from '../types';
import { analyzeCodeWarnings } from '../utils/warningAnalyzer';

interface SnippetListProps {
  snippets: CodeSnippet[];
  selectedSnippetId: string | null;
  onSelectSnippet: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDeleteSnippet: (id: string, e: React.MouseEvent) => void;
}

export const SnippetList: React.FC<SnippetListProps> = ({
  snippets,
  selectedSnippetId,
  onSelectSnippet,
  onToggleFavorite,
  onDeleteSnippet,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (snippet: CodeSnippet, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (snippets.length === 0) {
    return (
      <div className="w-80 border-r border-slate-800 bg-slate-900/40 p-6 flex flex-col items-center justify-center text-center text-slate-500">
        <FileCode2 className="h-10 w-10 text-slate-600 mb-3 stroke-1" />
        <p className="text-sm font-medium text-slate-400">No snippets found</p>
        <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or create a new snippet.</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-slate-800 bg-slate-900/40 overflow-y-auto shrink-0 flex flex-col divide-y divide-slate-800/60">
      {snippets.map((snippet) => {
        const isSelected = snippet.id === selectedSnippetId;
        const warnings = analyzeCodeWarnings(snippet.code, snippet.language);
        const criticalCount = warnings.filter(w => w.severity === 'critical').length;
        const warningCount = warnings.length;

        return (
          <div
            key={snippet.id}
            onClick={() => onSelectSnippet(snippet.id)}
            className={`p-3.5 cursor-pointer transition-all relative group ${
              isSelected
                ? 'bg-indigo-950/40 border-l-2 border-indigo-500'
                : 'hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-indigo-200' : 'text-slate-200'}`}>
                {snippet.title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => onToggleFavorite(snippet.id, e)}
                  title={snippet.isFavorite ? 'Unstar' : 'Star'}
                  className={`p-1 rounded hover:bg-slate-700/60 text-slate-400 transition-colors ${
                    snippet.isFavorite ? 'text-amber-400 fill-amber-400' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => handleCopy(snippet, e)}
                  title="Copy code"
                  className="p-1 rounded hover:bg-slate-700/60 text-slate-400 opacity-0 group-hover:opacity-100 transition-colors"
                >
                  {copiedId === snippet.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={(e) => onDeleteSnippet(snippet.id, e)}
                  title="Delete snippet"
                  className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed font-normal">
              {snippet.description || 'No description provided'}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                  {snippet.language}
                </span>

                {warningCount > 0 && (
                  <span 
                    title={`${warningCount} code warning(s) detected`}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      criticalCount > 0
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <AlertTriangle className="h-2.5 w-2.5" />
                    <span>{warningCount}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                <Clock className="h-2.5 w-2.5" />
                <span>{snippet.updatedAt || snippet.createdAt}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
