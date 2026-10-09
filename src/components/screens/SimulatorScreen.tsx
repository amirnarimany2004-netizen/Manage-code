import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Wrench, 
  Cpu, 
  Flame, 
  Truck, 
  Sparkles,
  ArrowRight,
  RotateCcw,
  WifiOff
} from 'lucide-react';
import { 
  verifyActivationCode, 
  cleanDeviceCode, 
  LicenseTier 
} from '../../crypto/licenseEngine';

interface SimulatorScreenProps {
  masterKey: string;
  initialDeviceId?: string;
  initialActivationCode?: string;
}

export const SimulatorScreen: React.FC<SimulatorScreenProps> = ({
  masterKey,
  initialDeviceId = '84920173',
  initialActivationCode = ''
}) => {
  const [simDeviceId, setSimDeviceId] = useState(initialDeviceId);
  const [enteredCode, setEnteredCode] = useState(initialActivationCode);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    isValid: boolean;
    tier?: LicenseTier;
    format?: string;
    errorReason?: string;
  }>({
    tested: false,
    isValid: false
  });

  useEffect(() => {
    if (initialDeviceId) setSimDeviceId(initialDeviceId);
    if (initialActivationCode) setEnteredCode(initialActivationCode);
  }, [initialDeviceId, initialActivationCode]);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyActivationCode(simDeviceId, enteredCode, masterKey);
      setVerificationResult({
        tested: true,
        isValid: result.isValid,
        tier: result.tier,
        format: result.matchedFormat,
        errorReason: result.errorReason
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setEnteredCode('');
    setVerificationResult({ tested: false, isValid: false });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-3xl mx-auto w-full" dir="rtl">
      {/* Top Simulator Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-slate-800/40 to-transparent border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100">
              شبیه‌ساز صفحه فعالسازی کلاینت دیاگ خودرویی
            </h2>
            <p className="text-xs text-slate-400">
              تست دقیق تجربه کاربر و بررسی آفلاین تطابق کلیدهای HMAC در سمت کلاینت
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shrink-0">
          <WifiOff className="w-3.5 h-3.5" />
          <span>۱۰۰٪ آفلاین</span>
        </div>
      </div>

      {/* Simulated Device Frame / Container */}
      <div className="bg-[#121822] border-2 border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl relative space-y-6">
        {/* Mock Automotive App Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
              HD
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">نرم‌افزار دیاگ هوشدار خودرو</div>
              <div className="text-[10px] text-slate-400">Hoshdar Automotive Diag OS</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            Client v4.1.0
          </span>
        </div>

        {/* Device Code display inside client app */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">
            شناسه سخت‌افزار این دستگاه (Hardware Device ID):
          </label>
          <div className="relative">
            <input
              type="text"
              value={simDeviceId}
              onChange={(e) => {
                setSimDeviceId(e.target.value.replace(/\D/g, ''));
                setVerificationResult({ tested: false, isValid: false });
              }}
              placeholder="84920173"
              className="w-full px-4 py-3 bg-[#0a0e14] border border-slate-800 rounded-xl font-mono text-base font-bold text-amber-400 focus:outline-none focus:border-amber-500 text-center tracking-widest"
              dir="ltr"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            کاربر این شناسه ۸ رقمی را برای تعمیرگاه یا پشتیبان شما می‌خواند یا پیامک می‌کند.
          </p>
        </div>

        {/* Activation Code input field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">
            کد فعالسازی دریافتی از پشتیبانی (Activation Key):
          </label>
          <div className="relative">
            <input
              type="text"
              value={enteredCode}
              onChange={(e) => {
                setEnteredCode(e.target.value);
                setVerificationResult({ tested: false, isValid: false });
              }}
              placeholder="مثال: 59054037 یا ABCD-EFGH-..."
              className="w-full px-4 py-3.5 bg-[#0a0e14] border-2 border-slate-800 focus:border-amber-500 rounded-xl font-mono text-xl font-black text-slate-100 placeholder-slate-600 focus:outline-none text-center tracking-wider transition-colors"
              dir="ltr"
            />
          </div>
        </div>

        {/* Action button */}
        <div className="flex gap-2.5">
          <button
            onClick={handleVerify}
            disabled={isVerifying || !enteredCode}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5 fill-slate-950" />
            <span>{isVerifying ? 'در حال ارزیابی امضای HMAC...' : 'بررسی و فعالسازی لایسنس'}</span>
          </button>

          {enteredCode && (
            <button
              onClick={handleReset}
              className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
              title="پاک کردن"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Validation Result Box */}
        {verificationResult.tested && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {verificationResult.isValid && verificationResult.tier ? (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-[#0e1713] border-2 border-emerald-500/80 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-300">
                      لایسنس با موفقیت فعال گردید!
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      امضای ریاضیاتی کد برای دستگاه {cleanDeviceCode(simDeviceId)} مورد تأیید کامل است.
                    </p>
                  </div>
                </div>

                {/* Tier details and features unlocked */}
                <div className="p-3.5 rounded-xl bg-[#09100c] border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      پکیج فعال شده:
                    </span>
                    <span 
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${verificationResult.tier.badgeColor}20`,
                        color: verificationResult.tier.badgeColor
                      }}
                    >
                      {verificationResult.tier.titleFa}
                    </span>
                  </div>

                  <div className="pt-1 border-t border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-400">دسترسی‌های باز شده:</span>
                    <ul className="mt-1.5 space-y-1">
                      {verificationResult.tier.features.map((feat, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/60 to-[#180e11] border-2 border-rose-500/80 space-y-2 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-rose-300">
                      خطا در فعالسازی لایسنس
                    </h4>
                    <p className="text-xs text-rose-200/90 mt-0.5">
                      {verificationResult.errorReason || 'کد فعالسازی با این شناسه دستگاه یا کلید امنیتی تطابق ندارد.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
