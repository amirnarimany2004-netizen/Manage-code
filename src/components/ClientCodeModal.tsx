import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Code2, 
  Download, 
  ShieldCheck, 
  Terminal,
  FileCode
} from 'lucide-react';
import { getKotlinValidatorCode, getJavaValidatorCode } from '../crypto/androidCodeTemplates';

interface ClientCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterKey: string;
}

export const ClientCodeModal: React.FC<ClientCodeModalProps> = ({
  isOpen,
  onClose,
  masterKey
}) => {
  const [lang, setLang] = useState<'kotlin' | 'java'>('kotlin');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const code = lang === 'kotlin' ? getKotlinValidatorCode(masterKey) : getJavaValidatorCode(masterKey);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = lang === 'kotlin' ? 'HoshdarLicenseValidator.kt' : 'HoshdarLicenseValidator.java';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-[#121720] border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161d28]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <span>سورس‌کد اعتبارسنجی برنامه کلاینت (Client Validator)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  HMAC-SHA256
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                این کلاس را در اپلیکیشن اندروید یا کلاینت دیاگ خود قرار دهید تا کدها را به‌صورت ۱۰۰٪ آفلاین تأیید کند.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-[#0e131a] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang('kotlin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                lang === 'kotlin'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>کاتلین (Kotlin - پیشنهادی)</span>
            </button>
            <button
              onClick={() => setLang('java')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                lang === 'java'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>جاوا (Java Legacy)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کپی شد!' : 'کپی سورس'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود فایل</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-[#090d12]">
          <pre className="text-xs font-mono text-emerald-300/90 leading-relaxed whitespace-pre selection:bg-amber-500/30 selection:text-white" dir="ltr">
            {code}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#161d28] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>نیاز به هیچ کتابخانه جانبی ندارد؛ تنها با کلاس‌های پیش‌فرض جاوا و کاتلین کار می‌کند.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
