import React, { useState } from 'react';
import { Mail, MoreVertical, Wifi, WifiOff, Settings, Upload, RefreshCw, Smartphone, ShieldCheck, Download } from 'lucide-react';
import { Language, PostmanSettings } from '../types';
import { translations } from '../i18n';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  settings: PostmanSettings;
  onOpenSettings: () => void;
  onOpenBulk: () => void;
  onResetDemo: () => void;
  onInstallPWA?: () => void;
  canInstall?: boolean;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isOnline,
  settings,
  onOpenSettings,
  onOpenBulk,
  onResetDemo,
  onInstallPWA,
  canInstall,
  onGoHome,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-[#8B0000] text-white shadow-md select-none">
      {/* Top App Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* App Logo & Title */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-7 h-7 text-white fill-current">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.4" />
              <path d="M25,35 Q50,55 75,35 L75,65 Q50,45 25,65 Z" fill="#FFE8E8" />
              <path d="M45,22 L58,22 L54,42 L66,42 L40,74 L46,50 L34,50 Z" fill="#FFD700" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight leading-none text-white">
                {t.appName}
              </h1>
              <span className="bg-red-950/80 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-amber-200 border border-amber-400/30">
                {t.postBadge}
              </span>
            </div>
            <p className="text-[11px] text-red-100/90 font-medium tracking-wide">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Section: Language Switcher & Menu */}
        <div className="flex items-center gap-2">
          {/* Language Toggle Pills */}
          <div className="bg-red-950/60 rounded-full p-0.5 flex items-center border border-white/15">
            {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-0.5 text-xs font-semibold rounded-full transition-all uppercase ${
                  language === lang
                    ? 'bg-white text-[#8B0000] shadow-sm font-bold'
                    : 'text-red-200 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* 3-Dots Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
              aria-label="Settings and options"
            >
              <MoreVertical className="w-5 h-5 text-white" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-2xl py-2 text-gray-800 z-50 border border-gray-100 text-sm animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {settings.beatArea} • {settings.postmanName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{settings.defaultPostOffice}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2.5 font-medium"
                  >
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span>{t.settings}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenBulk();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2.5 font-medium"
                  >
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span>{t.bulkIntimation}</span>
                  </button>

                  {canInstall && onInstallPWA && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onInstallPWA();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 text-[#8B0000] flex items-center gap-2.5 font-medium"
                    >
                      <Smartphone className="w-4 h-4 text-[#8B0000]" />
                      <span>Install Intimation PWA</span>
                    </button>
                  )}

                  <a
                    href="/api/download-source"
                    download
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-emerald-800 flex items-center gap-2.5 font-medium"
                  >
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Download App Code (.tar.gz)</span>
                  </a>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onResetDemo();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2.5 font-medium text-amber-700"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-600" />
                    <span>Reload Demo Records</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Header Ribbon: Beat, PO & Online Status */}
      <div className="bg-[#6B0000] px-4 py-1.5 flex items-center justify-between text-xs border-t border-white/10">
        <div className="flex items-center gap-1.5 font-medium text-red-100 truncate pr-2">
          <Mail className="w-3.5 h-3.5 flex-shrink-0 text-amber-300" />
          <span className="truncate">
            {settings.beatArea} • {settings.defaultPostOffice}
          </span>
        </div>

        {/* Live Connectivity Badge */}
        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase flex-shrink-0 ${
            isOnline
              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-400/30'
              : 'bg-amber-950/70 text-amber-300 border border-amber-400/40'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span>{isOnline ? t.online : t.offline}</span>
        </div>
      </div>
    </header>
  );
};
