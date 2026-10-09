import React from 'react';
import { 
  Folder, 
  Tag as TagIcon, 
  Code, 
  AlertTriangle, 
  Search, 
  Star,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { CodeSnippet } from '../types';

interface SidebarProps {
  snippets: CodeSnippet[];
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  selectedLanguage: string | null;
  onSelectLanguage: (lang: string | null) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  filterOnlyWarnings: boolean;
  onToggleFilterOnlyWarnings: () => void;
  filterFavorites: boolean;
  onToggleFilterFavorites: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  snippets,
  selectedCategory,
  onSelectCategory,
  selectedLanguage,
  onSelectLanguage,
  selectedTag,
  onSelectTag,
  filterOnlyWarnings,
  onToggleFilterOnlyWarnings,
  filterFavorites,
  onToggleFilterFavorites,
  searchQuery,
  onSearchChange
}) => {
  // Extract unique categories
  const categories = Array.from(new Set(snippets.map(s => s.category).filter(Boolean)));
  // Extract unique languages
  const languages = Array.from(new Set(snippets.map(s => s.language)));
  // Extract unique tags
  const tags = Array.from(new Set(snippets.flatMap(s => s.tags || [])));

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-5 shrink-0 overflow-y-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search snippets or code..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Quick Filters */}
      <div className="space-y-1">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2 mb-1.5 flex items-center justify-between">
          <span>Views</span>
        </div>
        
        <button
          onClick={() => {
            onSelectCategory(null);
            onSelectLanguage(null);
            onSelectTag(null);
          }}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !selectedCategory && !selectedLanguage && !selectedTag && !filterOnlyWarnings && !filterFavorites
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" />
            <span>All Snippets</span>
          </div>
          <span className="text-[10px] text-slate-500">{snippets.length}</span>
        </button>

        <button
          onClick={onToggleFilterFavorites}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterFavorites
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Star className={`h-3.5 w-3.5 ${filterFavorites ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span>Starred</span>
          </div>
          <span className="text-[10px] text-slate-500">
            {snippets.filter(s => s.isFavorite).length}
          </span>
        </button>

        <button
          onClick={onToggleFilterOnlyWarnings}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterOnlyWarnings
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-3.5 w-3.5 ${filterOnlyWarnings ? 'text-rose-400' : 'text-amber-400'}`} />
            <span>Audit Warnings</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400">
            Inspector
          </span>
        </button>
      </div>

      {/* Categories Section */}
      <div className="space-y-1">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2 mb-1.5 flex items-center gap-1.5">
          <Folder className="h-3.5 w-3.5" />
          <span>Categories</span>
        </div>
        {categories.map((cat) => {
          const count = snippets.filter(s => s.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(isSelected ? null : cat)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                isSelected
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className="truncate">{cat}</span>
              <span className="text-[10px] text-slate-500">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Languages Section */}
      <div className="space-y-1">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2 mb-1.5 flex items-center gap-1.5">
          <Code className="h-3.5 w-3.5" />
          <span>Languages</span>
        </div>
        <div className="flex flex-wrap gap-1.5 px-1">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => onSelectLanguage(isSelected ? null : lang)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="space-y-1">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-2 mb-1.5 flex items-center gap-1.5">
            <TagIcon className="h-3.5 w-3.5" />
            <span>Tags</span>
          </div>
          <div className="flex flex-wrap gap-1 px-1">
            {tags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => onSelectTag(isSelected ? null : tag)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span>Local Storage Sync</span>
        </div>
        <span>Snippet updates persist safely in your browser.</span>
      </div>
    </aside>
  );
};
