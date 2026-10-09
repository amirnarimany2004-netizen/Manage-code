import React, { useState } from 'react';
import { 
  Key, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  ArrowLeft, 
  Dices, 
  Code2, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Smartphone,
  Phone,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  LICENSE_TIERS, 
  DURATION_OPTIONS, 
  LicenseTier, 
  generate8DigitActivationCode, 
  generate16BlockActivationCode,
  cleanDeviceCode 
} from '../../crypto/licenseEngine';
import { GeneratedLicenseRecord } from '../../types/license';
import { toPersianDateString, calculateExpirationDate } from '../../utils/persianDate';

interface GeneratorScreenProps {
  masterKey: string;
  onSaveLicenseRecord: (record: GeneratedLicenseRecord) => void;
  onNavigateToSimulatorWithCode: (deviceId: string, code: string) => void;
  onOpenClientCodeModal: () => void;
}

export const GeneratorScreen: React.FC<GeneratorScreenProps> = ({
  masterKey,
  onSaveLicenseRecord,
  onNavigateToSimulatorWithCode,
  onOpenClientCodeModal
}) => {
  // Input fields
  const [customerName, setCustomerName] = useState('تعمیرگاه تخصصی کارن (مهندس رضایی)');
  const [customerPhone, setCustomerPhone] = useState('09121234567');
  const [deviceId, setDeviceId] = useState('84920173');
  const [selectedTier, setSelectedTier] = useState<LicenseTier>(LICENSE_TIERS[0]); // DPRO default
  const [format, setFormat] = useState<'8DIGIT' | '16BLOCK'>('8DIGIT');
  const [durationId, setDurationId] = useState<string>('1Y');

  // Generation state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Random 8-digit device code generator
  const handleGenerateRandomDeviceId = () => {
    const random8 = Math.floor(10000000 + Math.random() * 90000000).toString();
    setDeviceId(random8);
    setGeneratedCode(null);
  };

  // Generate activation code
  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const cleanDev = cleanDeviceCode(deviceId);
      let code = '';
      if (format === '8DIGIT') {
        code = await generate8DigitActivationCode(cleanDev, selectedTier.code, masterKey);
      } else {
        code = await generate16BlockActivationCode(cleanDev, selectedTier.code, masterKey);
      }
      setGeneratedCode(code);

      // Save to history records
      const durationOption = DURATION_OPTIONS.find(d => d.id === durationId) || DURATION_OPTIONS[2];
      const expiry = calculateExpirationDate(durationOption.days);

      const record: GeneratedLicenseRecord = {
        id: `lic-${Date.now()}`,
        customerName: customerName.trim() || 'مشتری آزاد',
        customerPhone: customerPhone.trim(),
        deviceId: cleanDev,
        tierCode: selectedTier.code,
        tierTitleFa: selectedTier.titleFa,
        tierBadgeColor: selectedTier.badgeColor,
        format,
        activationCode: code,
        durationId: durationOption.id,
        durationLabelFa: durationOption.labelFa,
        createdAt: new Date().toISOString(),
        createdAtShamsi: toPersianDateString(),
        expiresAt: expiry.shamsi,
        status: 'active'
      };

      onSaveLicenseRecord(record);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSms = () => {
    if (!generatedCode) return;
    const cleanDev = cleanDeviceCode(deviceId);
    const text = `همکار گرامی؛ کد فعالسازی نرم‌افزار دیاگ هوشدار برای شما صادر گردید.\n` +
      `سخت‌افزار: ${cleanDev}\n` +
      `پکیج: ${selectedTier.titleFa}\n` +
      `کد فعالسازی: ${generatedCode}\n` +
      `اعتبار: ${DURATION_OPTIONS.find(d => d.id === durationId)?.labelFa}\n` +
      `پشتیبانی دیاگ هوشدار: ۰۲۱-۸۸۸۸۰۰۰۰`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShareFeedback('متن رسمی پیامک با مشخصات کامل در کلیپ‌بورد کپی شد!');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full" dir="rtl">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100">
              تولید کد فعالسازی و لایسنس دیاگ هوشدار
            </h2>
            <p className="text-xs text-slate-400">
              فرمول انحصاری HMAC-SHA256 بر اساس شناسه سخت‌افزاری و پکیج نرم‌افزاری
            </p>
          </div>
        </div>

        <button
          onClick={onOpenClientCodeModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer shrink-0"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>کد برنامه کلاینت</span>
        </button>
      </div>

      {/* Main Input Form Card */}
      <div className="bg-[#131923] border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer / Workshop Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>نام مشتری یا تعمیرگاه (اختیاری)</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="مثال: کلینیک خودرویی سپهر"
              className="w-full px-3.5 py-2.5 bg-[#0b0f14] border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          {/* Customer Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>شماره تماس مشتری (جهت پیامک)</span>
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="0912..."
              className="w-full px-3.5 py-2.5 bg-[#0b0f14] border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors font-mono"
              dir="ltr"
            />
          </div>
        </div>

        {/* Device ID (8-digit) with Random button */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>شناسه دستگاه دیاگ (کد سخت‌افزاری ۸ رقمی)</span>
            </label>
            <button
              onClick={handleGenerateRandomDeviceId}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>تولید کد تصادفی تستی</span>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              maxLength={8}
              value={deviceId}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setDeviceId(val);
                setGeneratedCode(null);
              }}
              placeholder="84920173"
              className="w-full px-3.5 py-3 bg-[#0b0f14] border border-slate-800 rounded-xl text-lg sm:text-xl font-bold font-mono tracking-widest text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-center"
              dir="ltr"
            />
            <span className="absolute left-3 top-3.5 text-[10px] font-mono text-slate-500">
              {deviceId.length}/8 رقم
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            این کد در منوی «درباره برنامه» یا صفحه فعالسازی نرم‌افزار کاربر نهایی نمایش داده می‌شود.
          </p>
        </div>

        {/* Software Package / Tier Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>انتخاب پکیج نرم‌افزاری / سطح دسترسی</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LICENSE_TIERS.map((tier) => {
              const isSelected = selectedTier.id === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => {
                    setSelectedTier(tier);
                    setGeneratedCode(null);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/10'
                      : 'bg-[#0d121a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-100 flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: tier.badgeColor }}
                      ></span>
                      <span>{tier.titleFa}</span>
                    </span>
                    <span 
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                      style={{ 
                        color: tier.badgeColor, 
                        borderColor: `${tier.badgeColor}40`,
                        backgroundColor: `${tier.badgeColor}15`
                      }}
                    >
                      {tier.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {tier.descriptionFa}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Options Row: Format & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Code Format */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">فرمت کد فعالسازی</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setFormat('8DIGIT'); setGeneratedCode(null); }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  format === '8DIGIT'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-[#0b0f14] text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                عددی ۸ رقمی (استاندارد)
              </button>
              <button
                type="button"
                onClick={() => { setFormat('16BLOCK'); setGeneratedCode(null); }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  format === '16BLOCK'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-[#0b0f14] text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                ۱۶ کاراکتری بلوکی
              </button>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>مدت اعتبار لایسنس</span>
            </label>
            <select
              value={durationId}
              onChange={(e) => setDurationId(e.target.value)}
              className="w-full px-3 py-2 bg-[#0b0f14] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.labelFa}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerateCode}
            disabled={isGenerating || !deviceId}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{isGenerating ? 'در حال رمزنگاری HMAC-SHA256...' : 'تولید کد فعالسازی دیاگ'}</span>
          </button>
        </div>
      </div>

      {/* Result Card (When Generated) */}
      {generatedCode && (
        <div className="rounded-2xl bg-gradient-to-br from-[#1b2230] to-[#121722] border-2 border-amber-500/80 p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                لایسنس با موفقیت تولید شد
              </span>
              <h3 className="text-sm font-bold text-slate-100 mt-1">
                کد فعالسازی معتبر برای سخت‌افزار {cleanDeviceCode(deviceId)}
              </h3>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-400">
              <span className="font-semibold text-amber-400">{selectedTier.titleFa}</span>
              <span className="mx-2">•</span>
              <span>{DURATION_OPTIONS.find(d => d.id === durationId)?.labelFa}</span>
            </div>
          </div>

          {/* Large Monospace Activation Code */}
          <div className="bg-[#090d12] border border-amber-500/40 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-inner">
            <span className="text-[11px] font-semibold text-slate-400 mb-1">کد فعالسازی اختصاصی:</span>
            <div className="text-2xl sm:text-4xl font-black font-mono tracking-widest text-amber-400 py-1 selection:bg-amber-500 selection:text-slate-950" dir="ltr">
              {generatedCode}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">
              ALGORITHM: HMAC-SHA256 | PAYLOAD V2 | OFFLINE READY
            </span>
          </div>

          {shareFeedback && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{shareFeedback}</span>
            </div>
          )}

          {/* Action buttons inside Result Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={handleCopyCode}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? 'کپی شد!' : 'کپی کد فعالسازی'}</span>
            </button>

            <button
              onClick={handleShareSms}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>ارسال پیامک رسمی</span>
            </button>

            <button
              onClick={() => onNavigateToSimulatorWithCode(cleanDeviceCode(deviceId), generatedCode)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all cursor-pointer"
            >
              <span>تست در شبیه‌ساز</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
