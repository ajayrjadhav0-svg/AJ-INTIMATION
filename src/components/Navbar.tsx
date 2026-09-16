import React from 'react';
import { Home, Plus, QrCode, FileText } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

export type TabType = 'home' | 'scan' | 'history' | 'dashboard';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenNewIntimation: () => void;
  language: Language;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewIntimation,
  language,
}) => {
  const t = translations[language];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 py-1 select-none">
      <div className="max-w-lg mx-auto flex items-center justify-between relative">
        {/* 1. Home Tab */}
        <button
          type="button"
          id="nav-home"
          onClick={() => onSelectTab('home')}
          className={`flex-1 flex flex-col items-center py-1.5 transition-colors ${
            currentTab === 'home' ? 'text-[#8B0000]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              currentTab === 'home' ? 'bg-red-50' : 'bg-transparent'
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold mt-0.5">{t.home}</span>
        </button>

        {/* 2. Floating Center + Intimate Button */}
        <div className="flex-1 flex flex-col items-center -mt-6">
          <button
            type="button"
            id="nav-intimate-floating"
            onClick={onOpenNewIntimation}
            className="w-13 h-13 rounded-full bg-[#8B0000] hover:bg-[#740000] active:scale-95 text-white shadow-lg shadow-red-900/30 flex items-center justify-center border-4 border-white transition-all transform"
            aria-label="New Intimation"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[11px] font-bold text-[#8B0000] mt-1 tracking-tight">
            {t.intimateNav}
          </span>
        </div>

        {/* 3. Scan Tab */}
        <button
          type="button"
          id="nav-scan"
          onClick={() => onSelectTab('scan')}
          className={`flex-1 flex flex-col items-center py-1.5 transition-colors ${
            currentTab === 'scan' ? 'text-[#8B0000]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              currentTab === 'scan' ? 'bg-red-50' : 'bg-transparent'
            }`}
          >
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold mt-0.5">{t.scanNav}</span>
        </button>

        {/* 4. History Tab */}
        <button
          type="button"
          id="nav-history"
          onClick={() => onSelectTab('history')}
          className={`flex-1 flex flex-col items-center py-1.5 transition-colors ${
            currentTab === 'history' ? 'text-[#8B0000]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              currentTab === 'history' ? 'bg-red-50' : 'bg-transparent'
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold mt-0.5">{t.historyNav}</span>
        </button>
      </div>
    </nav>
  );
};
