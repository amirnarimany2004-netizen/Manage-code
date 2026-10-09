import { CodeSnippet } from '../types';

export const initialSnippets: CodeSnippet[] = [
  {
    id: 'snip-1',
    title: 'authMiddleware.ts',
    description: 'JWT Authentication and role-based permissions checker with token verification',
    category: 'Backend Security',
    language: 'typescript',
    tags: ['auth', 'jwt', 'security', 'express'],
    createdAt: '2026-09-15',
    updatedAt: '2026-10-02',
    isFavorite: true,
    code: `import { Request, Response, NextFunction } from 'express';

// TODO: Replace fallback secret with vault service credentials
const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_token_123456";

export interface AuthenticatedUser {
  id: string;
  role: 'admin' | 'editor' | 'viewer';
  email: string;
}

export function verifyUserSession(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    // WARN: Client didn't pass authorization header
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  
  // FIXME: Add token expiration cache checking
  if (token == "admin-bypass-key") {
    console.log("Warning: Admin bypass token used in session");
    return next();
  }

  try {
    // Standard signature validation logic
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired credentials' });
  }
}`
  },
  {
    id: 'snip-2',
    title: 'database_backup_job.py',
    description: 'Automated PostgreSQL database dump and cloud backup script',
    category: 'DevOps & Scripts',
    language: 'python',
    tags: ['python', 'postgres', 'backup', 'cron'],
    createdAt: '2026-08-20',
    updatedAt: '2026-09-28',
    isFavorite: true,
    code: `import os
import subprocess
import datetime

# Database connection settings
DB_NAME = os.getenv("DB_NAME", "production_app")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")

def run_backup():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"backup_{DB_NAME}_{timestamp}.sql"
    
    print(f"Starting backup for {DB_NAME} at {timestamp}...")
    
    try:
        cmd = f"pg_dump -h {DB_HOST} -U postgres {DB_NAME} > {backup_file}"
        subprocess.run(cmd, shell=True, check=True)
        print(f"Backup completed successfully: {backup_file}")
    except Exception as e:
        # BUG: Need automated alerting webhook if dump fails
        print(f"Backup failed: {str(e)}")
        raise e

if __name__ == "__main__":
    run_backup()`
  },
  {
    id: 'snip-3',
    title: 'interactiveCard.html',
    description: 'Responsive interactive glassmorphism UI card component with quick live preview',
    category: 'Frontend UI',
    language: 'html',
    tags: ['html', 'css', 'ui', 'component'],
    createdAt: '2026-09-10',
    updatedAt: '2026-10-05',
    isFavorite: false,
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: radial-gradient(circle at 10% 20%, #1e1b4b 0%, #0f172a 90%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      font-family: system-ui, sans-serif;
      margin: 0;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px);
      border-radius: 16px;
      padding: 24px;
      width: 320px;
      color: #f8fafc;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: #6366f1;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      background: #4f46e5;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    h2 { margin: 12px 0 6px; font-size: 18px; }
    p { color: #94a3b8; font-size: 13px; line-height: 1.5; }
    button {
      margin-top: 14px;
      width: 100%;
      padding: 10px;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    button:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Manage-code</span>
    <h2>Interactive Snippet</h2>
    <p>Live sandbox viewer running HTML, CSS, and interactive browser components directly inside Manage-code.</p>
    <button onclick="this.innerText = 'Run Action!'; this.style.backgroundColor='#10b981'">Test Interaction</button>
  </div>
</body>
</html>`
  },
  {
    id: 'snip-4',
    title: 'app-config.json',
    description: 'System configurations and runtime flags with schema validation',
    category: 'Configurations',
    language: 'json',
    tags: ['config', 'json', 'settings'],
    createdAt: '2026-10-01',
    updatedAt: '2026-10-08',
    isFavorite: false,
    code: `{
  "appName": "Manage-code",
  "version": "1.0.0",
  "environment": "production",
  "features": {
    "syntaxHighlighting": true,
    "warningAnalyzer": true,
    "liveSandboxing": true,
    "exportSnippet": true
  },
  "maxFileSizeBytes": 1048576,
  "supportedLanguages": [
    "typescript",
    "javascript",
    "python",
    "html",
    "css",
    "json",
    "sql",
    "shell",
    "markdown"
  ]
}`
  }
];
