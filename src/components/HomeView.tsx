import React from 'react';
import { Mail, PlusCircle, ArrowRight, QrCode, Clock, PieChart, Sparkles, Send, AlertTriangle, CloudOff } from 'lucide-react';
import { Intimation, Language } from '../types';
import { translations } from '../i18n';

interface HomeViewProps {
  language: Language;
  intimations: Intimation[];
  onNewIntimation: () => void;
  onScanArticle: () => void;
  onViewHistory: () => void;
  onViewDashboard: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  intimations,
  onNewIntimation,
  onScanArticle,
  onViewHistory,
  onViewDashboard,
}) => {
  const t = translations[language];

  // Calculate today's stats
  const totalCount = intimations.length;
  const sentCount = intimations.filter((i) => i.status === 'SENT').length;
  const failedCount = intimations.filter((i) => i.status === 'FAILED').length;
  const offlineCount = intimations.filter((i) => i.status === 'DRAFT' || i.status === 'READY').length;

  // Breakdown counts
  const panDlAtmCount = intimations.filter((i) =>
    ['PAN CARD', 'DRIVING LICENSE', 'ATM', 'RC BOOK'].includes(i.articleType.toUpperCase())
  ).length;
  const speedPostCount = intimations.filter((i) => i.articleType.toUpperCase() === 'SPEED POST').length;
  const regdLettersCount = intimations.filter((i) =>
    ['LETTERS', 'REGD POST', 'CHEQUE BOOK'].includes(i.articleType.toUpperCase())
  ).length;
  const courierDlCount = panDlAtmCount;

  const panDlPercent = totalCount > 0 ? Math.round((panDlAtmCount / totalCount) * 100) : 0;
  const speedPercent = totalCount > 0 ? Math.round((speedPostCount / totalCount) * 100) : 0;
  const regdPercent = totalCount > 0 ? Math.round((regdLettersCount / totalCount) * 100) : 0;

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-24">
      {/* 1. Today's Intimations Card (Matches image.png) */}
      <div
        onClick={onViewDashboard}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 tracking-tight uppercase">
                {t.todayIntimations}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {t.dltPortalSync}
              </p>
            </div>
          </div>
          <div className="text-3xl font-black text-red-900 tracking-tight">
            {totalCount}
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2.5 mt-4">
          <div className="bg-emerald-50/80 border border-emerald-100/80 rounded-xl py-2 px-1 text-center">
            <div className="text-lg font-bold text-emerald-700 leading-none">
              {sentCount}
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">
              {t.sent}
            </div>
          </div>

          <div className="bg-rose-50/80 border border-rose-100/80 rounded-xl py-2 px-1 text-center">
            <div className="text-lg font-bold text-rose-700 leading-none">
              {failedCount}
            </div>
            <div className="text-[11px] font-semibold text-rose-600 mt-1">
              {t.failed}
            </div>
          </div>

          <div className="bg-amber-50/80 border border-amber-100/80 rounded-xl py-2 px-1 text-center">
            <div className="text-lg font-bold text-amber-800 leading-none">
              {offlineCount}
            </div>
            <div className="text-[11px] font-semibold text-amber-700 mt-1">
              {t.offlineDrafts}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Action Button: + NEW INTIMATION (Matches image.png) */}
      <button
        type="button"
        id="btn-hero-new-intimation"
        onClick={onNewIntimation}
        className="w-full bg-[#8B0000] hover:bg-[#7A0000] active:bg-[#600000] text-white rounded-2xl p-4 shadow-lg shadow-red-900/20 flex items-center justify-between transition-all transform active:scale-[0.98] group"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors">
            <PlusCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white leading-tight">
              {t.newIntimation}
            </h3>
            <p className="text-xs text-red-200/90 font-medium">
              {t.fastDispatch}
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
          <ArrowRight className="w-5 h-5 text-white" />
        </div>
      </button>

      {/* 3. Two Secondary Action Cards (Matches image.png) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Scan Article Card */}
        <button
          type="button"
          id="btn-action-scan-article"
          onClick={onScanArticle}
          className="bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 tracking-tight uppercase leading-tight">
              {t.scanArticle}
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 leading-snug">
              {t.scanSub}
            </p>
          </div>
        </button>

        {/* Records Log Card */}
        <button
          type="button"
          id="btn-action-records-log"
          onClick={onViewHistory}
          className="bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 tracking-tight uppercase leading-tight">
              {t.recordsLog}
            </h4>
            <p className="text-[11px] text-gray-500 mt-1 leading-snug">
              Search {totalCount} dispatched items
            </p>
          </div>
        </button>
      </div>

      {/* 4. Daily Category Breakdown (Matches image.png) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-red-700 flex items-center justify-center">
              <div className="w-2.5 h-0.5 bg-red-700" />
            </div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              {t.dailyBreakdown}
            </h4>
          </div>

          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            {t.quickDemo}
          </span>
        </div>

        {/* Primary highlight category */}
        <div className="flex items-baseline justify-between text-xs font-medium text-gray-700 mb-2">
          <span>PAN Card / Driving License / ATM</span>
          <span className="font-bold text-red-900">
            {panDlAtmCount} items ({panDlPercent}%)
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${panDlPercent}%` }}
            className="bg-[#8B0000] h-full"
            title="PAN Card / DL"
          />
          <div
            style={{ width: `${speedPercent}%` }}
            className="bg-slate-500 h-full"
            title="Speed Post"
          />
          <div
            style={{ width: `${regdPercent}%` }}
            className="bg-amber-700 h-full"
            title="Registered Post"
          />
        </div>

        {/* Breakdown Sub-stats */}
        <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 mt-3 pt-2.5 border-t border-gray-50">
          <div>
            <span>{t.speedPost}: </span>
            <strong className="text-gray-800">{speedPostCount}</strong>
          </div>
          <div>
            <span>{t.regdLetters}: </span>
            <strong className="text-gray-800">{regdLettersCount}</strong>
          </div>
          <div>
            <span>{t.courierDl}: </span>
            <strong className="text-gray-800">{courierDlCount}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
