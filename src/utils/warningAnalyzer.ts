import { CodeLanguage, CodeWarning } from '../types';

export function analyzeCodeWarnings(code: string, language: CodeLanguage): CodeWarning[] {
  const warnings: CodeWarning[] = [];
  if (!code) return warnings;

  const lines = code.split('\n');

  // Check brackets balance
  let openBraces = 0;
  let openParens = 0;
  let openBrackets = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // 1. Check for TODOs, FIXMEs, BUG, HACK
    const todoMatch = line.match(/\b(TODO|FIXME|BUG|HACK|WARN|XXX)\b(?::|\s)?(.*)/i);
    if (todoMatch) {
      const tag = todoMatch[1].toUpperCase();
      warnings.push({
        id: `todo-${lineNum}`,
        line: lineNum,
        severity: tag === 'FIXME' || tag === 'BUG' ? 'warning' : 'todo',
        rule: `comment-${tag.toLowerCase()}`,
        message: `${tag} found: "${todoMatch[2]?.trim() || 'Action required'}"`,
        suggestion: 'Review item and implement resolution or track in project backlog.',
      });
    }

    // 2. Security: Hardcoded API keys, passwords, or tokens
    const secretPattern = /(api[_-]?key|secret|password|bearer|auth[_-]?token|private[_-]?key)\s*[:=]\s*["']([^"']{8,})["']/i;
    const secretMatch = line.match(secretPattern);
    if (secretMatch && !line.includes('process.env') && !line.includes('import.meta.env')) {
      warnings.push({
        id: `sec-secret-${lineNum}`,
        line: lineNum,
        severity: 'critical',
        rule: 'security/no-hardcoded-secrets',
        message: `Potential hardcoded sensitive credential detected: "${secretMatch[1]}"`,
        suggestion: 'Store secrets in environment variables (.env) or use a secret management service.',
      });
    }

    // 3. Security: eval() or Function() constructor
    if (/\beval\s*\(/.test(line)) {
      warnings.push({
        id: `sec-eval-${lineNum}`,
        line: lineNum,
        severity: 'critical',
        rule: 'security/no-eval',
        message: 'Direct invocation of eval() detected, allowing arbitrary script execution.',
        suggestion: 'Use structured parsers (e.g., JSON.parse) or safe domain-specific interpreters.',
      });
    }

    // 4. Security: dangerouslySetInnerHTML
    if (/dangerouslySetInnerHTML/.test(line)) {
      warnings.push({
        id: `sec-xss-${lineNum}`,
        line: lineNum,
        severity: 'warning',
        rule: 'security/dangerously-set-inner-html',
        message: 'Usage of dangerouslySetInnerHTML exposes DOM to Cross-Site Scripting (XSS).',
        suggestion: 'Sanitize content with DOMPurify or render standard React text elements.',
      });
    }

    // 5. Code Quality: console.log in production code
    if (/\bconsole\.(log|debug|info|trace)\s*\(/.test(line)) {
      warnings.push({
        id: `cq-console-${lineNum}`,
        line: lineNum,
        severity: 'info',
        rule: 'quality/no-console-log',
        message: 'Active console statement found. May leak runtime data or pollute terminal.',
        suggestion: 'Use a configurable logger or strip before production deployment.',
      });
    }

    // 6. Code Quality: debugger statement
    if (/\bdebugger\s*;?$/.test(trimmed)) {
      warnings.push({
        id: `cq-debugger-${lineNum}`,
        line: lineNum,
        severity: 'critical',
        rule: 'quality/no-debugger',
        message: 'Active debugger breakpoint left in code.',
        suggestion: 'Remove debugger before saving to production repository.',
      });
    }

    // 7. Code Quality: loose equality (== or !=) in JS/TS
    if (['javascript', 'typescript'].includes(language)) {
      const looseEq = line.match(/[^\!=<>](\s*==\s*|\s*!=\s*)[^=]/);
      if (looseEq && !trimmed.startsWith('//')) {
        warnings.push({
          id: `cq-loose-eq-${lineNum}`,
          line: lineNum,
          severity: 'warning',
          rule: 'quality/strict-equality',
          message: 'Loose equality check (`==` or `!=`) may cause unintended type coercion.',
          suggestion: 'Replace with strict equality (`===` or `!==`).',
        });
      }
    }

    // 8. Python specific: bare except
    if (language === 'python') {
      if (/^\s*except\s*:/.test(trimmed)) {
        warnings.push({
          id: `py-bare-except-${lineNum}`,
          line: lineNum,
          severity: 'warning',
          rule: 'python/no-bare-except',
          message: 'Bare `except:` catches SystemExit and KeyboardInterrupt silently.',
          suggestion: 'Catch specific exception types such as `except Exception:`.',
        });
      }
    }

    // 9. SQL specific: injection risk (concatenation in SQL)
    if (language === 'sql' || ['javascript', 'typescript', 'python'].includes(language)) {
      if (/(SELECT|INSERT|UPDATE|DELETE).*\+.*(?:req|input|user|params)/i.test(line) ||
          /(WHERE\s+\w+\s*=\s*['"]?\s*\$\{[^}]+\})/i.test(line)) {
        warnings.push({
          id: `sql-injection-${lineNum}`,
          line: lineNum,
          severity: 'critical',
          rule: 'security/sql-injection-risk',
          message: 'Possible SQL query string concatenation detected without parameterization.',
          suggestion: 'Use parameterized queries ($1, ? or prepared statements).',
        });
      }
    }

    // 10. Line length warning (> 140 chars)
    if (line.length > 150) {
      warnings.push({
        id: `fmt-line-len-${lineNum}`,
        line: lineNum,
        severity: 'info',
        rule: 'style/max-line-length',
        message: `Line length is ${line.length} characters (exceeds 150 limit).`,
        suggestion: 'Refactor statement or wrap across multiple lines.',
      });
    }

    // Balance counts
    for (const char of line) {
      if (char === '{') openBraces++;
      if (char === '}') openBraces--;
      if (char === '(') openParens++;
      if (char === ')') openParens--;
      if (char === '[') openBrackets++;
      if (char === ']') openBrackets--;
    }
  });

  // Check JSON validation
  if (language === 'json') {
    try {
      JSON.parse(code);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid JSON';
      warnings.unshift({
        id: 'json-syntax-error',
        line: 1,
        severity: 'critical',
        rule: 'syntax/json-parse-error',
        message: `JSON syntax error: ${errorMsg}`,
        suggestion: 'Ensure valid JSON format with double quotes and correct commas.',
      });
    }
  }

  // Structural bracket mismatches
  if (openBraces !== 0 && ['javascript', 'typescript', 'css', 'json'].includes(language)) {
    warnings.push({
      id: 'syntax-braces',
      line: lines.length,
      severity: 'critical',
      rule: 'syntax/unbalanced-braces',
      message: `Unbalanced curly braces: ${openBraces > 0 ? `${openBraces} unclosed '{'` : `${Math.abs(openBraces)} extra '}'`}`,
      suggestion: 'Check block opening and closing brackets.',
    });
  }

  if (openParens !== 0 && ['javascript', 'typescript', 'python', 'sql'].includes(language)) {
    warnings.push({
      id: 'syntax-parens',
      line: lines.length,
      severity: 'warning',
      rule: 'syntax/unbalanced-parentheses',
      message: `Unbalanced parentheses: ${openParens > 0 ? `${openParens} unclosed '('` : `${Math.abs(openParens)} extra ')'`}`,
      suggestion: 'Check function call and expression parentheses.',
    });
  }

  return warnings;
}
