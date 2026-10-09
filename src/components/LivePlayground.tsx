import React, { useState } from 'react';
import { Play, RotateCcw, Check, Sparkles, Copy } from 'lucide-react';
import { CodeSnippet } from '../types';

interface LivePlaygroundProps {
  snippet: CodeSnippet;
  onUpdateCode: (newCode: string) => void;
}

export const LivePlayground: React.FC<LivePlaygroundProps> = ({
  snippet,
  onUpdateCode
}) => {
  const [copied, setCopied] = useState(false);
  const [jsonFormatMsg, setJsonFormatMsg] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(snippet.code);
      const formatted = JSON.stringify(parsed, null, 2);
      onUpdateCode(formatted);
      setJsonFormatMsg('Formatted successfully!');
      setTimeout(() => setJsonFormatMsg(null), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON';
      setJsonFormatMsg(`Format failed: ${msg}`);
      setTimeout(() => setJsonFormatMsg(null), 3000);
    }
  };

  const isHtml = snippet.language === 'html';
  const isJson = snippet.language === 'json';

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Playground Toolbar */}
      <div className="h-10 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Play className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">
            {isHtml ? 'Live Browser Sandbox' : isJson ? 'JSON Formatter & Validator' : 'Output & Inspection Preview'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isJson && (
            <button
              onClick={formatJson}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>Prettify JSON</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {jsonFormatMsg && (
        <div className={`px-4 py-1.5 text-xs font-medium ${
          jsonFormatMsg.startsWith('Format failed')
            ? 'bg-rose-500/20 text-rose-300 border-b border-rose-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30'
        }`}>
          {jsonFormatMsg}
        </div>
      )}

      {/* Main Sandbox Area */}
      <div className="flex-1 overflow-auto p-4 flex flex-col">
        {isHtml ? (
          <iframe
            srcDoc={snippet.code}
            title="Live Preview"
            sandbox="allow-scripts allow-modals"
            className="w-full h-full min-h-[350px] border border-slate-800 rounded-lg bg-white shadow-inner"
          />
        ) : isJson ? (
          <div className="h-full flex flex-col">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 whitespace-pre overflow-auto max-h-[400px]">
              {(() => {
                try {
                  const obj = JSON.parse(snippet.code);
                  return JSON.stringify(obj, null, 2);
                } catch {
                  return 'Error parsing JSON. Check warnings panel for invalid syntax details.';
                }
              })()}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 border border-dashed border-slate-800 rounded-lg">
            <Play className="h-8 w-8 text-slate-600 mb-2" />
            <p className="text-xs font-medium text-slate-300">
              Interactive sandbox is optimized for HTML and JSON snippets.
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
              For {snippet.language} files, use the Warning Inspector panel to audit and analyze code structure, syntax, and potential risks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
