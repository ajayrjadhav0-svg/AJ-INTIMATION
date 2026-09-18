import React from 'react';
import { Mail, CheckCircle2, AlertCircle, Smartphone, Clock, PieChart, TrendingUp, ShieldCheck, ArrowLeft, MessageSquare, MessageCircle, Send } from 'lucide-react';
import { Intimation, Language } from '../types';
import { translations } from '../i18n';

interface DashboardViewProps {
  intimations: Intimation[];
  language: Language;
  onBackToHome?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ intimations, language, onBackToHome }) => {
  const t = translations[language];

  const total = intimations.length;
  const sent = intimations.filter((i) => i.status === 'SENT').length;
  const failed = intimations.filter((i) => i.status === 'FAILED').length;
  const manualSms = intimations.filter((i) => i.status === 'MANUAL SMS').length;
  const pending = intimations.filter((i) => i.status === 'DRAFT' || i.status === 'READY').length;

  const smsCount = intimations.filter((i) => !i.dispatchChannel || i.dispatchChannel === 'SMS').length;
  const whatsappCount = intimations.filter((i) => i.dispatchChannel === 'WHATSAPP').length;
  const bothCount = intimations.filter((i) => i.dispatchChannel === 'BOTH').length;

  const successRate = total > 0 ? Math.round((sent / total) * 100) : 100;

  // Breakdown by article type
  const typeCounts: { [type: string]: number } = {};
  intimations.forEach((item) => {
    const type = item.articleType || 'OTHER';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-16 text-gray-800">
      {/* Overview Header */}
      <div className="flex items-center gap-2.5">
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-gray-700 shadow-sm"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">
            Dispatch Analytics
          </h2>
          <p className="text-xs text-gray-500 font-medium">Real-time DLT Postal Intimation Metrics</p>
        </div>
      </div>

      {/* Success Rate Card */}
      <div className="bg-gradient-to-r from-[#8B0000] to-[#5e0000] rounded-2xl p-4 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-red-200 font-medium uppercase tracking-wider">
              Delivery Success Rate
            </p>
            <h3 className="text-3xl font-black mt-1 tracking-tight">{successRate}%</h3>
            <p className="text-[11px] text-red-100 mt-1">
              {sent} of {total} intimations delivered
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{t.sent}</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{sent}</div>
          <span className="text-[10px] text-gray-400 font-medium">Gateway Verified</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{t.failed}</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{failed}</div>
          <span className="text-[10px] text-gray-400 font-medium">Requires Retry</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Smartphone className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Manual SMS</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{manualSms}</div>
          <span className="text-[10px] text-gray-400 font-medium">Dispatched via Device</span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">{t.pending}</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{pending}</div>
          <span className="text-[10px] text-gray-400 font-medium">Offline Drafts</span>
        </div>
      </div>

      {/* Article Type Breakdown (Section 29) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#8B0000]" />
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Article Type Breakdown
          </h4>
        </div>

        <div className="space-y-2.5">
          {sortedTypes.map(([type, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-700">{type}</span>
                  <span className="text-gray-900 font-bold">
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="bg-[#8B0000] h-full rounded-full transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Channel Breakdown */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[#8B0000]" />
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Delivery Channel Split
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-gray-400">Total: {total}</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 text-blue-700 mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">SMS</span>
            </div>
            <div className="text-xl font-black text-gray-900">{smsCount}</div>
            <span className="text-[10px] text-gray-500 font-medium">
              {total > 0 ? Math.round((smsCount / total) * 100) : 0}%
            </span>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 text-emerald-700 mb-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">WhatsApp</span>
            </div>
            <div className="text-xl font-black text-gray-900">{whatsappCount}</div>
            <span className="text-[10px] text-gray-500 font-medium">
              {total > 0 ? Math.round((whatsappCount / total) * 100) : 0}%
            </span>
          </div>

          <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3">
            <div className="flex items-center justify-center gap-1 text-amber-800 mb-1">
              <span className="text-[11px] font-extrabold">⚡ Both</span>
            </div>
            <div className="text-xl font-black text-gray-900">{bothCount}</div>
            <span className="text-[10px] text-gray-500 font-medium">
              {total > 0 ? Math.round((bothCount / total) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
