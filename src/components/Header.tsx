import React from 'react';
import { 
  Code2, 
  AlertTriangle, 
  FileCode, 
  Plus, 
  Download, 
  Upload, 
  Terminal
} from 'lucide-react';
import { CodeSnippet } from '../types';

interface HeaderProps {
  snippets: CodeSnippet[];
  totalWarningsCount: number;
  criticalWarningsCount: number;
  onNewSnippet: () => void;
  onExportAll: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Header: React.FC<HeaderProps> = ({
  snippets,
  totalWarningsCount,
  criticalWarningsCount,
  onNewSnippet,
  onExportAll,
  onImportFile,
  fileInputRef
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-5 flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Code2 className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Manage-code
            </h1>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            Codebase & Snippet Hub with Built-in Warning Inspector
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Warning Counter Badge */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <FileCode className="h-3.5 w-3.5 text-indigo-400" />
            <span>{snippets.length} Files</span>
          </div>
          <div className="h-3 w-px bg-slate-700"></div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className={`h-3.5 w-3.5 ${criticalWarningsCount > 0 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={criticalWarningsCount > 0 ? 'text-rose-300 font-medium' : 'text-slate-300'}>
              {totalWarningsCount} Warnings
              {criticalWarningsCount > 0 && ` (${criticalWarningsCount} critical)`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onImportFile} 
            className="hidden" 
            accept=".json,.ts,.js,.py,.html,.css,.sql,.sh,.txt,.md"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import Code Snippet or JSON collection"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            onClick={onExportAll}
            title="Export all snippets as JSON backup"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <button
            onClick={onNewSnippet}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-all hover:shadow-indigo-600/25 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Snippet</span>
          </button>
        </div>
      </div>
    </header>
  );
};
