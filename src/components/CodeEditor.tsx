import React, { useRef, useEffect } from 'react';
import { 
  Code2, 
  AlertTriangle, 
  Play, 
  Save, 
  Copy, 
  Check, 
  Download,
  Tag as TagIcon,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { CodeSnippet, CodeLanguage, CodeWarning } from '../types';

interface CodeEditorProps {
  snippet: CodeSnippet;
  warnings: CodeWarning[];
  activeTab: 'editor' | 'warnings' | 'preview';
  setActiveTab: (tab: 'editor' | 'warnings' | 'preview') => void;
  onUpdateSnippet: (updated: Partial<CodeSnippet>) => void;
  targetLine: number | null;
  onClearTargetLine: () => void;
}

const SUPPORTED_LANGUAGES: CodeLanguage[] = [
  'typescript',
  'javascript',
  'python',
  'html',
  'css',
  'json',
  'sql',
  'shell',
  'markdown'
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  snippet,
  warnings,
  activeTab,
  setActiveTab,
  onUpdateSnippet,
  targetLine,
  onClearTargetLine
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);
  const [tagInput, setTagInput] = React.useState('');

  const lines = snippet.code.split('\n');
  const lineCount = lines.length;

  const criticalCount = warnings.filter(w => w.severity === 'critical').length;
  const warningCount = warnings.filter(w => w.severity === 'warning').length;

  // Handle line sync scroll
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Jump to targeted line if triggered from warnings
  useEffect(() => {
    if (targetLine && textareaRef.current) {
      const textarea = textareaRef.current;
      const linesArr = snippet.code.split('\n');
      let charIndex = 0;
      for (let i = 0; i < targetLine - 1 && i < linesArr.length; i++) {
        charIndex += linesArr[i].length + 1;
      }
      textarea.focus();
      textarea.setSelectionRange(charIndex, charIndex + (linesArr[targetLine - 1]?.length || 0));
      
      const lineHeight = 20;
      textarea.scrollTop = Math.max(0, (targetLine - 4) * lineHeight);
      onClearTargetLine();
    }
  }, [targetLine, snippet.code, onClearTargetLine]);

  // Handle Tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const updated = val.substring(0, start) + '  ' + val.substring(end);
      onUpdateSnippet({ code: updated });

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const extMap: Record<CodeLanguage, string> = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      sql: 'sql',
      shell: 'sh',
      markdown: 'md'
    };
    const ext = extMap[snippet.language] || 'txt';
    const filename = snippet.title.includes('.') ? snippet.title : `${snippet.title}.${ext}`;
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (newTag && !snippet.tags.includes(newTag)) {
        onUpdateSnippet({ tags: [...snippet.tags, newTag] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateSnippet({ tags: snippet.tags.filter(t => t !== tagToRemove) });
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Top File Meta Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Title & Category Input */}
          <div className="flex-1 min-w-[280px] flex items-center gap-2">
            <input
              type="text"
              value={snippet.title}
              onChange={(e) => onUpdateSnippet({ title: e.target.value })}
              placeholder="Snippet filename (e.g., script.ts)"
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sm font-semibold text-slate-100 focus:outline-none focus:border-indigo-500 w-64"
            />
            <input
              type="text"
              value={snippet.category}
              onChange={(e) => onUpdateSnippet({ category: e.target.value })}
              placeholder="Category"
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-36"
            />
          </div>

          {/* Language selector & actions */}
          <div className="flex items-center gap-2">
            <select
              value={snippet.language}
              onChange={(e) => onUpdateSnippet({ language: e.target.value as CodeLanguage })}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 cursor-pointer uppercase"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <button
              onClick={handleCopyCode}
              title="Copy snippet code"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              title="Download file"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description & Tags */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={snippet.description}
            onChange={(e) => onUpdateSnippet({ description: e.target.value })}
            placeholder="Brief description or purpose of this code..."
            className="flex-1 min-w-[200px] px-3 py-1 bg-slate-900/80 border border-slate-800/80 rounded-md text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex items-center gap-1.5 flex-wrap">
            {snippet.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-400 font-bold ml-0.5 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="+ add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 w-20"
            />
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="h-10 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Code Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('warnings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'warnings'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {criticalCount > 0 ? (
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
            ) : warnings.length > 0 ? (
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            )}
            <span>Warning Inspector</span>
            {warnings.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                criticalCount > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {warnings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="h-3.5 w-3.5 text-emerald-400" />
            <span>Preview & Sandbox</span>
          </button>
        </div>

        {/* Code metrics */}
        <div className="text-[11px] font-mono text-slate-500 hidden sm:flex items-center gap-3">
          <span>{lineCount} lines</span>
          <span>{snippet.code.length} chars</span>
          <span>{(new Blob([snippet.code]).size / 1024).toFixed(1)} KB</span>
        </div>
      </div>

      {/* Editor Content Area */}
      {activeTab === 'editor' && (
        <div className="flex-1 flex overflow-hidden relative font-mono text-xs">
          {/* Line Numbers */}
          <div
            ref={lineNumbersRef}
            className="w-12 bg-slate-950/80 border-r border-slate-800/80 py-3 pr-2 text-right select-none text-slate-600 font-mono text-xs overflow-hidden"
          >
            {Array.from({ length: lineCount }).map((_, i) => {
              const lineNum = i + 1;
              const hasWarning = warnings.find(w => w.line === lineNum);
              return (
                <div
                  key={lineNum}
                  className={`h-5 leading-5 text-[11px] flex items-center justify-end gap-1 ${
                    hasWarning?.severity === 'critical'
                      ? 'text-rose-400 font-bold'
                      : hasWarning?.severity === 'warning'
                      ? 'text-amber-400'
                      : hasWarning?.severity === 'todo'
                      ? 'text-indigo-400'
                      : ''
                  }`}
                >
                  {hasWarning && (
                    <span className="w-1.5 h-1.5 rounded-full bg-current inline-block"></span>
                  )}
                  <span>{lineNum}</span>
                </div>
              );
            })}
          </div>

          {/* Textarea Editor */}
          <textarea
            ref={textareaRef}
            value={snippet.code}
            onChange={(e) => onUpdateSnippet({ code: e.target.value })}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste your code snippet here..."
            spellCheck={false}
            className="flex-1 h-full p-3 bg-transparent text-slate-200 font-mono text-xs leading-5 resize-none focus:outline-none overflow-auto whitespace-pre tab-4"
            style={{ tabSize: 2 }}
          />
        </div>
      )}
    </div>
  );
};
