import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  FileText,
  Radio,
  Globe,
  Database,
  Save,
  Plus,
  Trash2,
  Check,
  Send,
  AlertCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import { ArticleType, Language, PostmanSettings, PostOffice } from '../types';
import { translations } from '../i18n';
import { generateId } from '../lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  settings: PostmanSettings;
  onSaveSettings: (newSettings: PostmanSettings) => void;
  articleTypes: ArticleType[];
  onSaveArticleTypes: (types: ArticleType[]) => void;
  postOffices: PostOffice[];
  onSavePostOffices: (pos: PostOffice[]) => void;
  onResetDemo: () => void;
  onClearAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  settings,
  onSaveSettings,
  articleTypes,
  onSaveArticleTypes,
  postOffices,
  onSavePostOffices,
  onResetDemo,
  onClearAllData,
}) => {
  const t = translations[language];

  // Tab navigation inside settings
  const [activeTab, setActiveTab] = useState<'profile' | 'articles' | 'postoffices' | 'sms' | 'data'>('profile');

  // Profile fields
  const [postmanName, setPostmanName] = useState(settings.postmanName || 'S. MORE');
  const [beatArea, setBeatArea] = useState(settings.beatArea || 'BEAT 04');
  const [mobileNumber, setMobileNumber] = useState(settings.mobileNumber || '9820011223');
  const [defaultPostOffice, setDefaultPostOffice] = useState(settings.defaultPostOffice || 'Kalwa Post Office (#400605)');
  const [defaultCollectionDays, setDefaultCollectionDays] = useState(settings.defaultCollectionDays || 3);

  // SMS Gateway fields
  const [smsProvider, setSmsProvider] = useState(settings.smsGatewayProvider || 'NATIONAL_POSTAL_DLT');
  const [smsSenderId, setSmsSenderId] = useState(settings.smsSenderId || 'DOPIND');
  const [smsDltTemplateId, setSmsDltTemplateId] = useState(settings.smsDltTemplateId || '1407161234567890123');
  const [testSmsStatus, setTestSmsStatus] = useState<string | null>(null);

  // New Article Type input
  const [newArticleTypeName, setNewArticleTypeName] = useState('');

  // New Post Office inputs
  const [newPoName, setNewPoName] = useState('');
  const [newPoPincode, setNewPoPincode] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    const updated: PostmanSettings = {
      ...settings,
      postmanName: postmanName.trim().toUpperCase(),
      beatArea: beatArea.trim().toUpperCase(),
      mobileNumber: mobileNumber.trim(),
      defaultPostOffice,
      defaultCollectionDays,
      smsGatewayProvider: smsProvider,
      smsSenderId: smsSenderId.trim().toUpperCase(),
      smsDltTemplateId: smsDltTemplateId.trim(),
    };
    onSaveSettings(updated);
    alert('Settings saved successfully!');
  };

  const handleAddArticleType = () => {
    if (!newArticleTypeName.trim()) return;
    const name = newArticleTypeName.trim().toUpperCase();
    if (articleTypes.some((a) => a.name.toUpperCase() === name)) {
      alert('This article type already exists');
      return;
    }

    const updated = [
      ...articleTypes,
      {
        id: generateId(),
        name,
        isCustom: true,
      },
    ];
    onSaveArticleTypes(updated);
    setNewArticleTypeName('');
  };

  const handleDeleteArticleType = (id: string) => {
    const updated = articleTypes.filter((a) => a.id !== id);
    onSaveArticleTypes(updated);
  };

  const handleAddPostOffice = () => {
    if (!newPoName.trim()) return;
    const fullName = newPoPincode.trim()
      ? `${newPoName.trim()} (#${newPoPincode.trim()})`
      : newPoName.trim();

    const updated = [
      ...postOffices,
      {
        id: generateId(),
        name: fullName,
        pincode: newPoPincode.trim(),
        isDefault: false,
      },
    ];
    onSavePostOffices(updated);
    setNewPoName('');
    setNewPoPincode('');
  };

  const handleSetDefaultPO = (name: string) => {
    setDefaultPostOffice(name);
    const updated = postOffices.map((po) => ({
      ...po,
      isDefault: po.name === name,
    }));
    onSavePostOffices(updated);
  };

  const handleDeletePO = (id: string) => {
    const updated = postOffices.filter((p) => p.id !== id);
    onSavePostOffices(updated);
  };

  const handleTestSMS = async () => {
    setTestSmsStatus('Sending test message...');
    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: mobileNumber || '9820011223',
          message: `DLT TEST: India Post Intimation Gateway operational for ${postmanName} (${beatArea}).`,
          customerName: postmanName,
          articleNumber: 'TEST123456789IN',
          templateId: smsDltTemplateId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestSmsStatus('✓ Test SMS sent successfully via DLT Gateway!');
      } else {
        setTestSmsStatus(`Failed: ${data.error}`);
      }
    } catch (e: any) {
      setTestSmsStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-xs text-gray-800">
        {/* Header */}
        <div className="bg-[#8B0000] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold uppercase tracking-tight">{t.settings}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50 px-2 pt-2 gap-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 font-bold rounded-t-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-[#8B0000] border-t border-x border-gray-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Postman
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3 py-2 font-bold rounded-t-xl transition-all ${
              activeTab === 'articles'
                ? 'bg-white text-[#8B0000] border-t border-x border-gray-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Article Types ({articleTypes.length})
          </button>
          <button
            onClick={() => setActiveTab('postoffices')}
            className={`px-3 py-2 font-bold rounded-t-xl transition-all ${
              activeTab === 'postoffices'
                ? 'bg-white text-[#8B0000] border-t border-x border-gray-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Post Offices ({postOffices.length})
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`px-3 py-2 font-bold rounded-t-xl transition-all ${
              activeTab === 'sms'
                ? 'bg-white text-[#8B0000] border-t border-x border-gray-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            DLT / SMS
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-2 font-bold rounded-t-xl transition-all ${
              activeTab === 'data'
                ? 'bg-white text-[#8B0000] border-t border-x border-gray-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Data & Lang
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Postman Name
                </label>
                <input
                  type="text"
                  value={postmanName}
                  onChange={(e) => setPostmanName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl font-semibold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Beat / Area
                  </label>
                  <input
                    type="text"
                    value={beatArea}
                    onChange={(e) => setBeatArea(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl font-semibold uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Default Post Office
                </label>
                <select
                  value={defaultPostOffice}
                  onChange={(e) => setDefaultPostOffice(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl font-semibold bg-white"
                >
                  {postOffices.map((po) => (
                    <option key={po.id} value={po.name}>
                      {po.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Default Collection Period (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={defaultCollectionDays}
                  onChange={(e) => setDefaultCollectionDays(parseInt(e.target.value, 10) || 3)}
                  className="w-24 px-3 py-2 border-2 border-gray-200 rounded-xl font-semibold text-center"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLE TYPES */}
          {activeTab === 'articles' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newArticleTypeName}
                  onChange={(e) => setNewArticleTypeName(e.target.value)}
                  placeholder="NEW ARTICLE TYPE (e.g. AADHAAR CARD)"
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl uppercase font-semibold text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddArticleType}
                  className="px-3 py-2 bg-[#8B0000] text-white font-bold rounded-xl hover:bg-[#740000]"
                >
                  Add Type
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {articleTypes.map((type) => (
                  <div key={type.id} className="p-2.5 flex items-center justify-between">
                    <span className="font-bold text-gray-800 uppercase">{type.name}</span>
                    {type.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteArticleType(type.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Delete Article Type"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: POST OFFICES */}
          {activeTab === 'postoffices' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPoName}
                    onChange={(e) => setNewPoName(e.target.value)}
                    placeholder="Post Office Name"
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl uppercase font-semibold text-xs"
                  />
                  <input
                    type="text"
                    value={newPoPincode}
                    onChange={(e) => setNewPoPincode(e.target.value)}
                    placeholder="PIN (400605)"
                    maxLength={6}
                    className="w-24 px-3 py-2 border-2 border-gray-200 rounded-xl uppercase font-semibold text-xs text-center"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddPostOffice}
                  className="w-full py-2 bg-[#8B0000] text-white font-bold rounded-xl hover:bg-[#740000]"
                >
                  Add Post Office
                </button>
              </div>

              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {postOffices.map((po) => (
                  <div key={po.id} className="p-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-800">{po.name}</span>
                      {po.name === defaultPostOffice && (
                        <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {po.name !== defaultPostOffice && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultPO(po.name)}
                          className="text-xs text-[#8B0000] font-bold hover:underline"
                        >
                          Make Default
                        </button>
                      )}
                      {postOffices.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeletePO(po.id)}
                          className="text-gray-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SMS / DLT SETTINGS */}
          {activeTab === 'sms' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Gateway Provider
                </label>
                <select
                  value={smsProvider}
                  onChange={(e) => setSmsProvider(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl font-semibold bg-white"
                >
                  <option value="NATIONAL_POSTAL_DLT">India Post National DLT Gateway (CDAC)</option>
                  <option value="FAST2SMS">Fast2SMS DLT Gateway</option>
                  <option value="SMS_COUNTRY">SMSCountry Indian Gateway</option>
                  <option value="SIMULATED_CARRIER">Carrier Operator Delivery Simulator</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Sender ID (6-character Header)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={smsSenderId}
                  onChange={(e) => setSmsSenderId(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  DLT Approved Template ID
                </label>
                <input
                  type="text"
                  value={smsDltTemplateId}
                  onChange={(e) => setSmsDltTemplateId(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestSMS}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test SMS to {mobileNumber}</span>
                </button>
                {testSmsStatus && (
                  <p className="text-[11px] font-semibold text-center mt-2 text-gray-700">
                    {testSmsStatus}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DATA & LANGUAGE */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-2">
                  Language / भाषा / भाषा
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => onLanguageChange(lang)}
                      className={`py-2 px-3 rounded-xl border font-bold text-xs capitalize ${
                        language === lang
                          ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <label className="block font-bold text-gray-700 uppercase">
                  Data & Source Code Export
                </label>

                <a
                  href="/api/download-source"
                  download
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl flex items-center justify-center gap-1.5 border border-emerald-300"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>Download Complete Code Files (.tar.gz)</span>
                </a>

                <button
                  type="button"
                  onClick={onResetDemo}
                  className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl flex items-center justify-center gap-1.5 border border-amber-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload Sample Demo Records (25 items)</span>
                </button>

                <button
                  type="button"
                  onClick={onClearAllData}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl flex items-center justify-center gap-1.5 border border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Records</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-gray-700 text-xs hover:bg-gray-100"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="px-5 py-2.5 rounded-xl bg-[#8B0000] text-white font-bold text-xs shadow-md hover:bg-[#740000] flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
