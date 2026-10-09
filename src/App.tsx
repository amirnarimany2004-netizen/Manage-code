import React, { useState, useEffect } from 'react';
import { M3TopAppBar } from './components/M3TopAppBar';
import { M3NavigationBar } from './components/M3NavigationBar';
import { GeneratorScreen } from './components/screens/GeneratorScreen';
import { SimulatorScreen } from './components/screens/SimulatorScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { ClientCodeModal } from './components/ClientCodeModal';
import { DEFAULT_MASTER_KEY } from './crypto/licenseEngine';
import { GeneratedLicenseRecord, ActiveScreen } from './types/license';

const STORAGE_LICENSES_KEY = 'hoshdar_diag_licenses_history_v1';
const STORAGE_MASTER_KEY = 'hoshdar_diag_master_key_v1';

const INITIAL_HISTORY: GeneratedLicenseRecord[] = [
  {
    id: 'lic-demo-1',
    customerName: 'تیونینگ و ریمپ تخصصی البرز (مهندس کاظمی)',
    customerPhone: '09123456789',
    deviceId: '84920173',
    tierCode: 'REMAP',
    tierTitleFa: 'ریمپ و تیونینگ ECU (REMAP)',
    tierBadgeColor: '#ec4899',
    format: '8DIGIT',
    activationCode: '59054037',
    durationId: '1Y',
    durationLabelFa: '۱ ساله (استاندارد سالانه)',
    createdAt: '2026-10-01T10:00:00.000Z',
    createdAtShamsi: '۱۴۰۵/۰۷/۱۰ - ۱۰:۰۰',
    expiresAt: '۱۴۰۶/۰۷/۱۰',
    status: 'active'
  },
  {
    id: 'lic-demo-2',
    customerName: 'کلینیک عیب‌یابی دیاگ پیشتاز (تهرانپارس)',
    customerPhone: '09351112233',
    deviceId: '91823471',
    tierCode: 'LFT',
    tierTitleFa: 'نسخه نامحدود طلایی (LFT)',
    tierBadgeColor: '#f59e0b',
    format: '8DIGIT',
    activationCode: '72819402',
    durationId: 'LIFETIME',
    durationLabelFa: 'مادام‌العمر (بدون انقضا)',
    createdAt: '2026-09-20T14:30:00.000Z',
    createdAtShamsi: '۱۴۰۵/۰۶/۳۰ - ۱۴:۳۰',
    expiresAt: 'مادام‌العمر (بدون محدودیت)',
    status: 'active'
  }
];

export function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('generator');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  // Master Secret Key
  const [masterKey, setMasterKey] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MASTER_KEY);
      if (saved && saved.trim()) return saved.trim();
    } catch {}
    return DEFAULT_MASTER_KEY;
  });

  // History Records
  const [records, setRecords] = useState<GeneratedLicenseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LICENSES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_HISTORY;
  });

  // Simulator initial values
  const [simulatorParams, setSimulatorParams] = useState<{ deviceId: string; code: string }>({
    deviceId: '84920173',
    code: ''
  });

  // Save records to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LICENSES_KEY, JSON.stringify(records));
    } catch {}
  }, [records]);

  // Save master key to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MASTER_KEY, masterKey);
    } catch {}
  }, [masterKey]);

  const handleSaveLicenseRecord = (record: GeneratedLicenseRecord) => {
    setRecords(prev => [record, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleClearAllRecords = () => {
    setRecords([]);
  };

  const handleNavigateToSimulatorWithCode = (deviceId: string, code: string) => {
    setSimulatorParams({ deviceId, code });
    setActiveScreen('simulator');
  };

  return (
    <div className="min-h-screen w-screen bg-[#090d12] text-slate-100 flex flex-col overflow-hidden font-sans select-none" dir="rtl">
      {/* Top Application Bar */}
      <M3TopAppBar
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        onOpenClientCodeModal={() => setIsClientModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-0 sm:p-2 bg-[#090d12]">
        {isPhoneFrame ? (
          /* Android Smartphone Frame Simulation */
          <div className="w-full max-w-[420px] h-[96vh] max-h-[860px] bg-[#0e131b] border-[8px] border-[#222a36] rounded-[44px] shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-white/10">
            {/* Phone Notch & Status Bar */}
            <div className="h-7 bg-[#10151f] flex items-center justify-between px-6 text-[10px] text-slate-400 select-none border-b border-slate-800/40">
              <span className="font-mono font-bold text-slate-300">12:30</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto -mt-1"></div>
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-300">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Screen Content inside phone */}
            <div className="flex-1 overflow-y-auto flex flex-col bg-[#0b0f14]">
              {activeScreen === 'generator' && (
                <GeneratorScreen
                  masterKey={masterKey}
                  onSaveLicenseRecord={handleSaveLicenseRecord}
                  onNavigateToSimulatorWithCode={handleNavigateToSimulatorWithCode}
                  onOpenClientCodeModal={() => setIsClientModalOpen(true)}
                />
              )}
              {activeScreen === 'simulator' && (
                <SimulatorScreen
                  masterKey={masterKey}
                  initialDeviceId={simulatorParams.deviceId}
                  initialActivationCode={simulatorParams.code}
                />
              )}
              {activeScreen === 'history' && (
                <HistoryScreen
                  records={records}
                  onDeleteRecord={handleDeleteRecord}
                  onClearAllRecords={handleClearAllRecords}
                  onNavigateToSimulator={handleNavigateToSimulatorWithCode}
                />
              )}
              {activeScreen === 'settings' && (
                <SettingsScreen
                  masterKey={masterKey}
                  onUpdateMasterKey={setMasterKey}
                  onOpenClientCodeModal={() => setIsClientModalOpen(true)}
                />
              )}
            </div>

            {/* Bottom M3 Navigation Bar inside phone */}
            <M3NavigationBar
              activeScreen={activeScreen}
              onSelectScreen={setActiveScreen}
              historyCount={records.length}
            />

            {/* Android Home indicator bar */}
            <div className="h-4 bg-[#10151f] flex items-center justify-center pb-1">
              <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
            </div>
          </div>
        ) : (
          /* Full Industrial Technician Dashboard Layout */
          <div className="w-full h-full flex flex-col overflow-hidden bg-[#0b0f14]">
            <div className="flex-1 overflow-y-auto flex flex-col">
              {activeScreen === 'generator' && (
                <GeneratorScreen
                  masterKey={masterKey}
                  onSaveLicenseRecord={handleSaveLicenseRecord}
                  onNavigateToSimulatorWithCode={handleNavigateToSimulatorWithCode}
                  onOpenClientCodeModal={() => setIsClientModalOpen(true)}
                />
              )}
              {activeScreen === 'simulator' && (
                <SimulatorScreen
                  masterKey={masterKey}
                  initialDeviceId={simulatorParams.deviceId}
                  initialActivationCode={simulatorParams.code}
                />
              )}
              {activeScreen === 'history' && (
                <HistoryScreen
                  records={records}
                  onDeleteRecord={handleDeleteRecord}
                  onClearAllRecords={handleClearAllRecords}
                  onNavigateToSimulator={handleNavigateToSimulatorWithCode}
                />
              )}
              {activeScreen === 'settings' && (
                <SettingsScreen
                  masterKey={masterKey}
                  onUpdateMasterKey={setMasterKey}
                  onOpenClientCodeModal={() => setIsClientModalOpen(true)}
                />
              )}
            </div>

            {/* Bottom Navigation Bar */}
            <M3NavigationBar
              activeScreen={activeScreen}
              onSelectScreen={setActiveScreen}
              historyCount={records.length}
            />
          </div>
        )}
      </div>

      {/* Client Integration Code Modal */}
      <ClientCodeModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        masterKey={masterKey}
      />
    </div>
  );
}

export default App;
