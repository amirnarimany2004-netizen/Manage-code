import React from 'react';
import { 
  Cpu, 
  Smartphone, 
  Monitor, 
  Code2, 
  ShieldCheck, 
  Key,
  Wrench
} from 'lucide-react';

interface M3TopAppBarProps {
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenClientCodeModal: () => void;
}

export const M3TopAppBar: React.FC<M3TopAppBarProps> = ({
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenClientCodeModal
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#10151e]/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between shrink-0 z-20" dir="rtl">
      {/* Brand & App info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black">
          <Wrench className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-sm sm:text-base text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>هوشدار دیاگ</span>
              <span className="text-amber-400 font-mono text-xs font-bold">Hoshdar Diag</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold hidden xs:inline-block">
              لایسنس منیجر v2.6
            </span>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>موتور رمزنگاری خودرویی HMAC-SHA256</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 hidden sm:inline">آفلاین و ضد تقلب</span>
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Client code dialog button */}
        <button
          onClick={onOpenClientCodeModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          title="مشاهده سورس کد کلاینت اندروید"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">کد کلاینت کاتلین</span>
        </button>

        {/* View mode toggle (Mobile Frame vs Widescreen) */}
        <button
          onClick={onTogglePhoneFrame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171f2b] hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-medium transition-all cursor-pointer"
          title={isPhoneFrame ? "تغییر به حالت داشبورد عریض" : "تغییر به فریم گوشی اندروید"}
        >
          {isPhoneFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">حالت تبلت / دسکتاپ</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">فریم موبایل اندروید</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
