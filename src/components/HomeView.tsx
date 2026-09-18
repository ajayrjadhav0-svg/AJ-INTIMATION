import React from 'react';
import { PlusCircle, ArrowRight, Clock } from 'lucide-react';
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
  onViewHistory,
}) => {
  const t = translations[language];
  const totalCount = intimations.length;

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-12">
      {/* Hero Action Button: + NEW INTIMATION */}
      <button
        type="button"
        id="btn-hero-new-intimation"
        onClick={onNewIntimation}
        className="w-full bg-[#8B0000] hover:bg-[#7A0000] active:bg-[#600000] text-white rounded-2xl p-5 shadow-lg shadow-red-900/20 flex items-center justify-between transition-all transform active:scale-[0.98] group"
      >
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors">
            <PlusCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white leading-tight">
              {t.newIntimation}
            </h3>
            <p className="text-xs text-red-200/90 font-medium mt-0.5">
              {t.fastDispatch}
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
          <ArrowRight className="w-5 h-5 text-white" />
        </div>
      </button>

      {/* Records Log Card */}
      <button
        type="button"
        id="btn-action-records-log"
        onClick={onViewHistory}
        className="w-full bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 tracking-tight uppercase leading-tight">
              {t.recordsLog}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Search & view {totalCount} dispatched items
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all" />
      </button>
    </div>
  );
};
