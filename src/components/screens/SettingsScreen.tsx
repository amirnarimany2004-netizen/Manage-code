import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  RotateCcw, 
  Check, 
  Code2, 
  Cpu, 
  Lock, 
  FileCode, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DEFAULT_MASTER_KEY } from '../../crypto/licenseEngine';

interface SettingsScreenProps {
  masterKey: string;
  onUpdateMasterKey: (newKey: string) => void;
  onOpenClientCodeModal: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  masterKey,
  onUpdateMasterKey,
  onOpenClientCodeModal
}) => {
  const [customKey, setCustomKey] = useState(masterKey);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (!customKey.trim()) return;
    onUpdateMasterKey(customKey.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setCustomKey(DEFAULT_MASTER_KEY);
    onUpdateMasterKey(DEFAULT_MASTER_KEY);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-3xl mx-auto w-full" dir="rtl">
      {/* Title */}
      <div>
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>تنظیمات امنیتی و موتور رمزنگاری</span>
        </h2>
        <p className="text-xs text-slate-400">
          پیکربندی کلید اصلی رمزنگاری (Master Secret Key) و مستندات یکپارچه‌سازی با نرم‌افزار کلاینت
        </p>
      </div>

      {/* Master Secret Key Card */}
      <div className="bg-[#121822] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-200">
                کلید امنیتی مادر (Master Secret Key)
              </h3>
              <p className="text-[11px] text-slate-400">
                این کلید برای امضای دیجیتال HMAC-SHA256 تمامی کدهای فعالسازی استفاده می‌شود.
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی به پیش‌فرض</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="w-full px-3.5 py-3 bg-[#0a0e14] border border-slate-800 rounded-xl font-mono text-xs sm:text-sm text-amber-400 focus:outline-none focus:border-amber-500 tracking-wider"
              dir="ltr"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              توجه: تغییر این کلید باعث بی‌اعتبار شدن کدهای قبلی در کلاینت‌های قدیمی می‌گردد.
            </span>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{isSaved ? 'ذخیره شد' : 'ذخیره کلید جدید'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Integration Code Exporter Banner */}
      <div className="bg-[#121822] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                سورس‌کد کلاس اعتبارسنجی کلاینت (Kotlin / Java)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                کدهای آماده جهت قرار دادن در پروژه اندروید دیاگ کلاینت برای اعتبارسنجی ۱۰۰٪ آفلاین لایسنس‌ها بر اساس فرمول HMAC-SHA256
              </p>
            </div>
          </div>

          <button
            onClick={onOpenClientCodeModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer shrink-0"
          >
            مشاهده و کپی
          </button>
        </div>
      </div>

      {/* Cryptographic Formula Technical Specs Card */}
      <div className="bg-[#121822] border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl text-xs text-slate-300">
        <div className="flex items-center gap-2 text-slate-100 font-bold border-b border-slate-800 pb-2">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>مشخصات فنی فرمول ریاضیاتی (Cryptographic Specification)</span>
        </div>

        <div className="space-y-2 leading-relaxed text-slate-400">
          <p>
            <strong className="text-slate-200">الگوریتم رمزنگاری:</strong> HMAC مبتنی بر SHA-256 با طول خروجی ۲۵۶ بیت (۶۴ کاراکتر Hex).
          </p>
          <div className="p-3 bg-[#0a0e14] rounded-xl border border-slate-800/80 font-mono text-[11px] text-amber-400/90" dir="ltr">
            {'Payload = "HOSHDAR_DIAG_ACTIVATION_8DIGIT_V2:{cleanDevice8}:{tierCode}:HMAC_SHA256"'}
          </div>
          <p>
            <strong className="text-slate-200">تبدیل به عدد ۸ رقمی:</strong>
            ۱۲ کاراکتر اول رشته Hex خروجی HMAC جدا شده و به عدد در مبنای ۱۶ تبدیل می‌شود. سپس با فرمول زیر عدد ۸ رقمی بین ۱۰۰۰۰۰۰۰ تا ۹۹۹۹۹۹۹۹ استخراج می‌شود:
          </p>
          <div className="p-3 bg-[#0a0e14] rounded-xl border border-slate-800/80 font-mono text-[11px] text-emerald-400/90" dir="ltr">
            eightDigit = 10000000L + (Math.abs(parsedVal) % 90000000L)
          </div>
        </div>
      </div>

      {/* App Info Footer */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-500 space-y-1">
        <div className="font-semibold text-slate-400">سامانه مدیریت لایسنس دیاگ خودرویی هوشدار</div>
        <div>نسخه: 2.6.0 صنعتی • استک: Kotlin / Jetpack Compose Architecture • پشتیبانی RTL</div>
      </div>
    </div>
  );
};
