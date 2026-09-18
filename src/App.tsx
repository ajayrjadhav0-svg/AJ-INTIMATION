import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { TabType } from './components/Navbar';
import { NewIntimationModal } from './components/NewIntimationModal';
import { CameraScannerModal } from './components/CameraScannerModal';
import { HistoryView } from './components/HistoryView';
import { DashboardView } from './components/DashboardView';
import { BulkIntimationModal } from './components/BulkIntimationModal';
import { SettingsModal } from './components/SettingsModal';
import { ArticleType, Intimation, Language, PostmanSettings, PostOffice } from './types';
import { StorageService } from './lib/storage';

export default function App() {
  // Global State
  const [language, setLanguage] = useState<Language>(StorageService.getLanguage());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Domain State
  const [intimations, setIntimations] = useState<Intimation[]>([]);
  const [settings, setSettings] = useState<PostmanSettings>(StorageService.getSettings());
  const [articleTypes, setArticleTypes] = useState<ArticleType[]>(StorageService.getArticleTypes());
  const [postOffices, setPostOffices] = useState<PostOffice[]>(StorageService.getPostOffices());

  // Modals & Navigation
  const [isNewIntimationOpen, setIsNewIntimationOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<Partial<Intimation> | undefined>(undefined);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Load Initial Data & seed if empty
  useEffect(() => {
    const loaded = StorageService.getIntimations();
    setIntimations(loaded);

    // Online / Offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA Install prompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    StorageService.saveLanguage(lang);
  };

  const handleSaveIntimation = (intimation: Intimation) => {
    StorageService.saveIntimation(intimation);
    setIntimations(StorageService.getIntimations());
  };

  const handleSaveBulk = (newRecords: Intimation[]) => {
    StorageService.saveBulkIntimations(newRecords);
    setIntimations(StorageService.getIntimations());
    setCurrentTab('history');
  };

  const handleRepeatIntimation = (record: Intimation) => {
    setPrefillData({
      customerName: record.customerName,
      mobileNumber: record.mobileNumber,
      articleType: record.articleType,
      articleNumber: '', // Let postman enter or scan new article barcode
      postOffice: record.postOffice,
      collectionDays: record.collectionDays,
    });
    setIsNewIntimationOpen(true);
  };

  const handleAddArticleType = (name: string): ArticleType => {
    const created = StorageService.addArticleType(name);
    setArticleTypes(StorageService.getArticleTypes());
    return created;
  };

  const handleResetDemoData = () => {
    if (confirm('Reload demo records (25 items as shown in preview)?')) {
      const demoRecords = StorageService.resetDemoData();
      setIntimations(demoRecords);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all saved intimation records?')) {
      StorageService.clearAll();
      setIntimations([]);
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col antialiased text-gray-900 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        isOnline={isOnline}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBulk={() => setIsBulkOpen(true)}
        onResetDemo={handleResetDemoData}
        onInstallPWA={handleInstallPWA}
        canInstall={!!deferredPrompt}
        onGoHome={() => setCurrentTab('home')}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1 w-full max-w-lg mx-auto overflow-x-hidden">
        {currentTab === 'home' && (
          <HomeView
            language={language}
            intimations={intimations}
            onNewIntimation={() => {
              setPrefillData(undefined);
              setIsNewIntimationOpen(true);
            }}
            onScanArticle={() => setIsScannerOpen(true)}
            onViewHistory={() => setCurrentTab('history')}
            onViewDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'scan' && (
          <div className="p-4 text-center space-y-4 max-w-lg mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
              <h3 className="text-base font-bold text-gray-900 uppercase">Camera Barcode Scanner</h3>
              <p className="text-xs text-gray-500">
                Scan Indian Post tracking barcodes and address slips to automatically prefill intimations.
              </p>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="w-full py-3.5 bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider hover:bg-[#740000]"
              >
                📷 Open Camera Scanner
              </button>
            </div>
          </div>
        )}

        {currentTab === 'history' && (
          <HistoryView
            intimations={intimations}
            language={language}
            onRepeatIntimation={handleRepeatIntimation}
            onBackToHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            intimations={intimations}
            language={language}
            onBackToHome={() => setCurrentTab('home')}
          />
        )}
      </main>

      {/* Modal 1: New Intimation Modal */}
      <NewIntimationModal
        isOpen={isNewIntimationOpen}
        onClose={() => {
          setIsNewIntimationOpen(false);
          setPrefillData(undefined);
        }}
        language={language}
        settings={settings}
        articleTypes={articleTypes}
        postOffices={postOffices}
        onAddArticleType={handleAddArticleType}
        onSaveIntimation={handleSaveIntimation}
        onOpenScanner={() => setIsScannerOpen(true)}
        prefillData={prefillData}
        isOnline={isOnline}
      />

      {/* Modal 2: Camera Scanner Modal with OCR */}
      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        language={language}
        onApplyDetectedDetails={(details) => {
          setPrefillData({
            articleNumber: details.articleNumber,
            customerName: details.customerName,
            articleType: details.articleType,
          });
          setIsScannerOpen(false);
          setIsNewIntimationOpen(true);
        }}
      />

      {/* Modal 3: Bulk Intimation Modal */}
      <BulkIntimationModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        language={language}
        defaultPostOffice={settings.defaultPostOffice}
        onSaveBulkIntimations={handleSaveBulk}
      />

      {/* Modal 4: Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onLanguageChange={handleLanguageChange}
        settings={settings}
        onSaveSettings={(s) => {
          StorageService.saveSettings(s);
          setSettings(s);
        }}
        articleTypes={articleTypes}
        onSaveArticleTypes={(types) => {
          StorageService.saveArticleTypes(types);
          setArticleTypes(types);
        }}
        postOffices={postOffices}
        onSavePostOffices={(pos) => {
          StorageService.savePostOffices(pos);
          setPostOffices(pos);
        }}
        onResetDemo={handleResetDemoData}
        onClearAllData={handleClearAll}
      />
    </div>
  );
}
