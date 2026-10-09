import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Copy, 
  Check, 
  Share2, 
  Trash2, 
  Download, 
  Clock, 
  Smartphone, 
  User, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { GeneratedLicenseRecord } from '../../types/license';

interface HistoryScreenProps {
  records: GeneratedLicenseRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAllRecords: () => void;
  onNavigateToSimulator: (deviceId: string, code: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  records,
  onDeleteRecord,
  onClearAllRecords,
  onNavigateToSimulator
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.customerName.toLowerCase().includes(q);
        const matchPhone = r.customerPhone.includes(q);
        const matchDev = r.deviceId.includes(q);
        const matchCode = r.activationCode.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchDev && !matchCode) return false;
      }
      if (selectedTierFilter !== 'ALL' && r.tierCode !== selectedTierFilter) {
        return false;
      }
      return true;
    });
  }, [records, searchQuery, selectedTierFilter]);

  const handleCopyCode = (record: GeneratedLicenseRecord) => {
    navigator.clipboard.writeText(record.activationCode);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareRecord = (record: GeneratedLicenseRecord) => {
    const text = `کد فعالسازی دیاگ هوشدار برای ${record.customerName}:\n` +
      `سخت‌افزار: ${record.deviceId}\n` +
      `پکیج: ${record.tierTitleFa}\n` +
      `کد فعالسازی: ${record.activationCode}\n` +
      `تاریخ صدور: ${record.createdAtShamsi}\n` +
      `اعتبار: ${record.durationLabelFa}`;

    navigator.clipboard.writeText(text);
    alert('اطلاعات لایسنس جهت ارسال کپی شد.');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `hoshdar-diag-licenses-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleExportCsv = () => {
    let csv = 'ID,Customer,Phone,DeviceID,Tier,Code,Duration,CreatedAt,ExpiresAt,Status\n';
    records.forEach(r => {
      csv += `"${r.id}","${r.customerName}","${r.customerPhone}","${r.deviceId}","${r.tierCode}","${r.activationCode}","${r.durationLabelFa}","${r.createdAtShamsi}","${r.expiresAt}","${r.status}"\n`;
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hoshdar-licenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-4xl mx-auto w-full" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <span>تاریخچه لایسنس‌های صادر شده</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono font-bold">
              {records.length} رکورد
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            مدیریت کامل، جستجو و استعلام کدهای فعالسازی صادر شده به همراه جزییات
          </p>
        </div>

        {/* Export and Clear Actions */}
        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                title="خروجی فایل اکسل / CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">اکسل (CSV)</span>
              </button>

              <button
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                title="پشتیبان‌گیری JSON"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">بکاپ JSON</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('آیا از پاکسازی کل تاریخچه لایسنس‌ها اطمینان دارید؟')) {
                    onClearAllRecords();
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
                title="پاکسازی تمام رکوردها"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس نام مشتری، شماره تماس یا کد دستگاه..."
            className="w-full pr-10 pl-3 py-2 bg-[#10151f] border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={selectedTierFilter}
            onChange={(e) => setSelectedTierFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#10151f] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">تمام پکیج‌ها (همه سطوح)</option>
            <option value="DPRO">دیاگ تخصصی (DPRO)</option>
            <option value="REMAP">ریمپ و تیونینگ (REMAP)</option>
            <option value="FLEET">پایش ناوگان (FLEET)</option>
            <option value="LFT">نسخه طلایی (LFT)</option>
          </select>
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-[#10151f] border border-slate-800/80 rounded-2xl p-10 text-center space-y-3">
          <History className="w-12 h-12 text-slate-600 mx-auto stroke-1" />
          <h3 className="text-sm font-bold text-slate-300">هیچ لایسنسی یافت نشد</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {records.length === 0
              ? 'هنوز لایسنسی صادر نشده است. از تب «تولید لایسنس» اولین کد را ایجاد کنید.'
              : 'با فیلترهای جستجوی فعلی رکوردی پیدا نشد.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-[#121822] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-md space-y-3"
            >
              {/* Row 1: Customer & Tier Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 shrink-0 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{record.customerName}</h4>
                    {record.customerPhone && (
                      <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                        {record.customerPhone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span 
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                    style={{ 
                      color: record.tierBadgeColor,
                      borderColor: `${record.tierBadgeColor}50`,
                      backgroundColor: `${record.tierBadgeColor}15`
                    }}
                  >
                    {record.tierTitleFa}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    فعال
                  </span>
                </div>
              </div>

              {/* Row 2: Device & Activation Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0a0e14] p-3 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">شناسه دستگاه (Device ID):</span>
                  <span className="text-sm font-mono font-bold text-slate-200 tracking-wider">
                    {record.deviceId}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">کد فعالسازی (Activation Code):</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-mono font-black text-amber-400 tracking-wider select-all" dir="ltr">
                      {record.activationCode}
                    </span>
                    <button
                      onClick={() => handleCopyCode(record)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title="کپی کد فعالسازی"
                    >
                      {copiedId === record.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Timestamps and Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-400">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>صدور: {record.createdAtShamsi}</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>اعتبار: {record.durationLabelFa}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToSimulator(record.deviceId, record.activationCode)}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold text-xs border border-blue-500/30 transition-colors cursor-pointer"
                  >
                    تست در شبیه‌ساز
                  </button>

                  <button
                    onClick={() => handleShareRecord(record)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="اشتراک‌گذاری"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  </button>

                  <button
                    onClick={() => onDeleteRecord(record.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title="حذف رکورد"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
