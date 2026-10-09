import React from 'react';
import { 
  Key, 
  Smartphone, 
  History, 
  ShieldCheck
} from 'lucide-react';
import { ActiveScreen } from '../types/license';

interface M3NavigationBarProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  historyCount?: number;
}

export const M3NavigationBar: React.FC<M3NavigationBarProps> = ({
  activeScreen,
  onSelectScreen,
  historyCount = 0
}) => {
  const tabs = [
    {
      id: 'generator' as ActiveScreen,
      title: 'تولید لایسنس',
      icon: Key,
      badge: null
    },
    {
      id: 'simulator' as ActiveScreen,
      title: 'شبیه‌ساز دیاگ',
      icon: Smartphone,
      badge: null
    },
    {
      id: 'history' as ActiveScreen,
      title: 'تاریخچه صدور',
      icon: History,
      badge: historyCount > 0 ? historyCount : null
    },
    {
      id: 'settings' as ActiveScreen,
      title: 'تنظیمات و امنیت',
      icon: ShieldCheck,
      badge: null
    }
  ];

  return (
    <nav className="h-16 bg-[#10151f] border-t border-slate-800/90 px-2 sm:px-6 flex items-center justify-around shrink-0 z-10 select-none shadow-lg" dir="rtl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeScreen === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectScreen(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all cursor-pointer relative group ${
              isActive
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active Pill Indicator (Material 3 style) */}
            <div
              className={`flex items-center justify-center w-12 h-7 rounded-full transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                  : 'bg-transparent group-hover:bg-slate-800/40 text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
            </div>

            <span className={`text-[11px] mt-1 transition-all ${isActive ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
              {tab.title}
            </span>

            {/* Badge */}
            {tab.badge && (
              <span className="absolute top-1 left-1/2 -translate-x-7 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 font-mono shadow-sm">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
