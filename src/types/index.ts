export type CodeLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'sql'
  | 'shell'
  | 'markdown';

export type WarningSeverity = 'critical' | 'warning' | 'info' | 'todo';

export interface CodeWarning {
  id: string;
  line: number;
  column?: number;
  severity: WarningSeverity;
  rule: string;
  message: string;
  suggestion?: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: CodeLanguage;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

export interface WarningFilter {
  all: boolean;
  critical: boolean;
  warning: boolean;
  info: boolean;
  todo: boolean;
}
