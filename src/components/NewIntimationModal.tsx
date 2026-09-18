import React, { useState, useEffect, useId } from 'react';
import {
  X,
  Camera,
  Copy,
  Share2,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowLeft,
  Smartphone,
  Info,
  ExternalLink,
  MessageSquare,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';
import { ArticleType, DispatchChannel, Intimation, Language, PostmanSettings, PostOffice } from '../types';
import { generateSmsMessage, translations } from '../i18n';
import {
  cleanIndianMobileNumber,
  generateId,
  getTodayDateStr,
  maskMobileNumber,
  StorageService
} from '../lib/storage';

interface NewIntimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  settings: PostmanSettings;
  articleTypes: ArticleType[];
  postOffices: PostOffice[];
  onAddArticleType: (name: string) => ArticleType;
  onSaveIntimation: (intimation: Intimation) => void;
  onOpenScanner: () => void;
  prefillData?: Partial<Intimation>;
  isOnline: boolean;
}

export const NewIntimationModal: React.FC<NewIntimationModalProps> = ({
  isOpen,
  onClose,
  language,
  settings,
  articleTypes,
  postOffices,
  onAddArticleType,
  onSaveIntimation,
  onOpenScanner,
  prefillData,
  isOnline,
}) => {
  const t = translations[language];

  // Form State
  const [mobileNumber, setMobileNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [articleType, setArticleType] = useState('PAN CARD');
  const [articleNumber, setArticleNumber] = useState('');
  const [postOffice, setPostOffice] = useState(settings.defaultPostOffice || 'Kalwa Post Office (#400605)');
  const [intimationDate, setIntimationDate] = useState(getTodayDateStr());
  const [collectionDays, setCollectionDays] = useState<number>(settings.defaultCollectionDays || 3);
  const [customDays, setCustomDays] = useState<string>('3');
  const [isCustomDays, setIsCustomDays] = useState(false);

  // Delivery Channel: 'SMS' | 'WHATSAPP' | 'BOTH'
  const [dispatchChannel, setDispatchChannel] = useState<DispatchChannel>('BOTH');

  // Message & Customization
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isManualEditMessage, setIsManualEditMessage] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // UI Flow modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [duplicateWarningRecord, setDuplicateWarningRecord] = useState<Intimation | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Submission / Fallback status
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessRecord, setSendSuccessRecord] = useState<Intimation | null>(null);
  const [sendErrorReason, setSendErrorReason] = useState<string | null>(null);

  // Recent Numbers
  const [recentMobiles, setRecentMobiles] = useState<string[]>([]);

  // Load recent mobiles on mount
  useEffect(() => {
    setRecentMobiles(StorageService.getRecentMobiles());
  }, [isOpen]);

  // Handle prefill data (e.g. from Scanner or Repeat)
  useEffect(() => {
    if (prefillData) {
      if (prefillData.customerName) setCustomerName(prefillData.customerName);
      if (prefillData.mobileNumber) setMobileNumber(prefillData.mobileNumber);
      if (prefillData.articleType) setArticleType(prefillData.articleType);
      if (prefillData.articleNumber) setArticleNumber(prefillData.articleNumber.toUpperCase().replace(/\s/g, ''));
      if (prefillData.postOffice) setPostOffice(prefillData.postOffice);
      if (prefillData.intimationDate) setIntimationDate(prefillData.intimationDate);
      if (prefillData.collectionDays) setCollectionDays(prefillData.collectionDays);
    }
  }, [prefillData]);

  // Sync default post office from settings if not set
  useEffect(() => {
    if (!postOffice && settings.defaultPostOffice) {
      setPostOffice(settings.defaultPostOffice);
    }
  }, [settings.defaultPostOffice]);

  // Live SMS message generation
  useEffect(() => {
    if (!isManualEditMessage) {
      const msg = generateSmsMessage({
        name: customerName,
        articleType,
        postOffice,
        articleNumber,
        days: collectionDays,
        date: intimationDate,
        language,
      });
      setGeneratedMessage(msg);
    }
  }, [customerName, articleType, postOffice, articleNumber, collectionDays, intimationDate, language, isManualEditMessage]);

  if (!isOpen) return null;

  // Article Number formatting & duplicate check
  const handleArticleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/\s/g, '');
    setArticleNumber(val);

    if (val.length >= 8) {
      const duplicate = StorageService.findDuplicateArticle(val);
      if (duplicate && duplicate.id !== prefillData?.id) {
        setDuplicateWarningRecord(duplicate);
      } else {
        setDuplicateWarningRecord(null);
      }
    } else {
      setDuplicateWarningRecord(null);
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setMobileNumber(raw);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleShareMessage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Postal Intimation',
          text: generatedMessage,
        });
      } catch (err) {
        // User cancelled or share not supported
      }
    } else {
      handleCopyMessage();
    }
  };

  const handleOpenSMSApp = (recordToSave?: Partial<Intimation>) => {
    const { normalized } = cleanIndianMobileNumber(mobileNumber);
    const smsUrl = `sms:${normalized}?body=${encodeURIComponent(generatedMessage)}`;

    // Create record as MANUAL SMS
    const newRecord: Intimation = {
      id: generateId(),
      customerName: customerName.trim().toUpperCase() || 'CUSTOMER',
      mobileNumber: normalized,
      articleType,
      articleNumber: articleNumber.trim().toUpperCase(),
      postOffice,
      intimationDate,
      collectionDays,
      message: generatedMessage,
      status: 'MANUAL SMS',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      dispatchChannel: 'SMS',
      ...recordToSave,
    };

    onSaveIntimation(newRecord);
    setShowConfirmModal(false);
    setSendSuccessRecord(newRecord);

    // Trigger native SMS app
    window.location.href = smsUrl;
  };

  const handleOpenWhatsApp = (recordToSave?: Partial<Intimation>) => {
    const { normalized } = cleanIndianMobileNumber(mobileNumber);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${normalized}&text=${encodeURIComponent(generatedMessage)}`;

    // Create record as SENT via WhatsApp
    const newRecord: Intimation = {
      id: generateId(),
      customerName: customerName.trim().toUpperCase() || 'CUSTOMER',
      mobileNumber: normalized,
      articleType,
      articleNumber: articleNumber.trim().toUpperCase(),
      postOffice,
      intimationDate,
      collectionDays,
      message: generatedMessage,
      status: 'SENT',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      dispatchChannel: 'WHATSAPP',
      ...recordToSave,
    };

    onSaveIntimation(newRecord);
    setShowConfirmModal(false);
    setSendSuccessRecord(newRecord);

    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSaveAsDraft = () => {
    const { normalized } = cleanIndianMobileNumber(mobileNumber);
    const newRecord: Intimation = {
      id: generateId(),
      customerName: customerName.trim().toUpperCase() || 'CUSTOMER',
      mobileNumber: normalized || mobileNumber,
      articleType,
      articleNumber: articleNumber.trim().toUpperCase(),
      postOffice,
      intimationDate,
      collectionDays,
      message: generatedMessage,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    };

    onSaveIntimation(newRecord);
    onClose();
  };

  // Validate and open confirmation dialog
  const handleInitiateSend = () => {
    const mobileValidation = cleanIndianMobileNumber(mobileNumber);
    if (!mobileValidation.valid) {
      alert(mobileValidation.error || 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (!customerName.trim()) {
      alert(t.namePlaceholder);
      return;
    }

    if (!articleNumber.trim()) {
      alert(t.articlePlaceholder);
      return;
    }

    if (duplicateWarningRecord) {
      setShowDuplicateModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  // Actual Intimation Dispatch logic based on selected channel (SMS, WhatsApp, or Both)
  const handleExecuteSend = async () => {
    setIsSending(true);
    setSendErrorReason(null);

    const mobileValidation = cleanIndianMobileNumber(mobileNumber);
    const cleanMobile = mobileValidation.normalized;
    const cleanArticleNum = articleNumber.trim().toUpperCase();
    const cleanName = customerName.trim().toUpperCase();
    const requestId = `REQ-${cleanMobile}-${cleanArticleNum}-${Date.now()}`;

    // 1. WhatsApp Only Channel
    if (dispatchChannel === 'WHATSAPP') {
      setIsSending(false);
      handleOpenWhatsApp();
      return;
    }

    // 2. Channels with SMS (SMS only or BOTH)
    try {
      if (!isOnline) {
        throw new Error('You are offline. Please send via native SMS app or WhatsApp.');
      }

      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          to: cleanMobile,
          message: generatedMessage,
          customerName: cleanName,
          articleNumber: cleanArticleNum,
          templateId: settings.smsDltTemplateId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'SMS delivery failed');
      }

      // If channel is BOTH: Also trigger WhatsApp!
      if (dispatchChannel === 'BOTH') {
        const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanMobile}&text=${encodeURIComponent(generatedMessage)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }

      // Record successfully sent
      const newRecord: Intimation = {
        id: generateId(),
        customerName: cleanName,
        mobileNumber: cleanMobile,
        articleType,
        articleNumber: cleanArticleNum,
        postOffice,
        intimationDate,
        collectionDays,
        message: generatedMessage,
        status: 'SENT',
        createdAt: new Date().toISOString(),
        sentAt: new Date().toISOString(),
        dispatchChannel,
      };

      onSaveIntimation(newRecord);
      setIsSending(false);
      setShowConfirmModal(false);
      setSendSuccessRecord(newRecord);
    } catch (err: any) {
      setIsSending(false);
      setSendErrorReason(err?.message || 'Intimation could not be sent.');
    }
  };

  const handleResetForm = () => {
    setMobileNumber('');
    setCustomerName('');
    setArticleType('PAN CARD');
    setArticleNumber('');
    setIntimationDate(getTodayDateStr());
    setCollectionDays(settings.defaultCollectionDays || 3);
    setIsCustomDays(false);
    setIsManualEditMessage(false);
    setSendSuccessRecord(null);
    setSendErrorReason(null);
    setShowConfirmModal(false);
  };

  // Calculation of SMS GSM length
  const charCount = generatedMessage.length;
  const isMultiPart = charCount > 160;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="bg-[#8B0000] text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-base font-bold uppercase tracking-tight">
              {t.newIntimation}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-gray-800 text-sm">
          {/* 1. Customer Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">
              {t.customerMobile} <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm font-bold text-gray-400">
                +91
              </span>
              <input
                type="tel"
                id="input-mobile-number"
                value={mobileNumber}
                onChange={handleMobileChange}
                placeholder="9876543210"
                maxLength={14}
                className="w-full pl-12 pr-4 py-3 text-base font-semibold border-2 border-gray-200 rounded-xl focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Quick Pick from Recent Mobiles */}
            {recentMobiles.length > 0 && !mobileNumber && (
              <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                <span className="text-[11px] font-medium text-gray-400 flex-shrink-0">
                  Recent:
                </span>
                {recentMobiles.map((mob) => (
                  <button
                    key={mob}
                    type="button"
                    onClick={() => setMobileNumber(mob)}
                    className="text-xs bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-900 px-2 py-0.5 rounded-lg border border-gray-200 flex-shrink-0 font-medium"
                  >
                    {mob}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Addressee Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">
              {t.addresseeName} <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="input-customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value.toUpperCase())}
              placeholder="e.g. AJAY JADHAV"
              className="w-full px-4 py-3 text-base font-semibold border-2 border-gray-200 rounded-xl focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] outline-none transition-all placeholder:text-gray-300 uppercase"
            />
          </div>

          {/* 3. Article Type Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase">
                {t.articleType} <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAddTypeModal(true)}
                className="text-xs text-[#8B0000] font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.addNewArticleType}
              </button>
            </div>

            <select
              id="select-article-type"
              value={articleType}
              onChange={(e) => {
                if (e.target.value === '__ADD_NEW__') {
                  setShowAddTypeModal(true);
                } else {
                  setArticleType(e.target.value);
                }
              }}
              className="w-full px-4 py-3 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] outline-none transition-all bg-white"
            >
              {articleTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
              <option value="__ADD_NEW__" className="text-[#8B0000] font-bold">
                + ADD NEW ARTICLE TYPE...
              </option>
            </select>
          </div>

          {/* 4. Article Number + Scan Camera Button */}
          <div>
            <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">
              {t.articleNumber} <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="input-article-number"
                value={articleNumber}
                onChange={handleArticleNumberChange}
                placeholder="e.g. TA123456789IN"
                className={`flex-1 px-4 py-3 text-base font-mono font-bold tracking-wider uppercase border-2 rounded-xl focus:ring-1 outline-none transition-all placeholder:text-gray-300 ${
                  duplicateWarningRecord
                    ? 'border-amber-400 bg-amber-50/40 text-amber-900 focus:border-amber-500 focus:ring-amber-500'
                    : 'border-gray-200 focus:border-[#8B0000] focus:ring-[#8B0000]'
                }`}
              />

              <button
                type="button"
                id="btn-inline-scan-article"
                onClick={onOpenScanner}
                className="bg-[#8B0000] hover:bg-[#740000] text-white px-4 py-3 rounded-xl font-bold flex items-center gap-1.5 flex-shrink-0 shadow-sm transition-transform active:scale-95 text-xs"
              >
                <Camera className="w-4 h-4" />
                <span>📷 SCAN</span>
              </button>
            </div>

            {/* Duplicate Warning notice */}
            {duplicateWarningRecord && (
              <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold leading-tight">
                    {t.duplicateWarning}
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    {articleNumber} was entered on {duplicateWarningRecord.intimationDate} ({duplicateWarningRecord.customerName}).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 5. Post Office & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">
                {t.postOffice}
              </label>
              <select
                id="select-post-office"
                value={postOffice}
                onChange={(e) => setPostOffice(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold border-2 border-gray-200 rounded-xl focus:border-[#8B0000] outline-none bg-white truncate"
              >
                {postOffices.map((po) => (
                  <option key={po.id} value={po.name}>
                    {po.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">
                {t.intimationDate}
              </label>
              <input
                type="text"
                id="input-intimation-date"
                value={intimationDate}
                onChange={(e) => setIntimationDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-3 py-2.5 text-xs font-semibold border-2 border-gray-200 rounded-xl focus:border-[#8B0000] outline-none text-center"
              />
            </div>
          </div>

          {/* 6. Collect Within Days */}
          <div>
            <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-1.5">
              {t.collectWithin}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 5, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setCollectionDays(num);
                    setIsCustomDays(false);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    !isCustomDays && collectionDays === num
                      ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {num} {num === 1 ? t.day : t.days}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsCustomDays(true)}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                  isCustomDays
                    ? 'bg-[#8B0000] text-white border-[#8B0000]'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                Custom
              </button>
            </div>

            {isCustomDays && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Enter Days:</span>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={customDays}
                  onChange={(e) => {
                    setCustomDays(e.target.value);
                    const parsed = parseInt(e.target.value, 10);
                    if (!isNaN(parsed) && parsed > 0) {
                      setCollectionDays(parsed);
                    }
                  }}
                  className="w-20 px-2 py-1 border-2 border-gray-300 rounded-lg text-xs font-bold text-center"
                />
              </div>
            )}
          </div>

          {/* 7. Live SMS Message Preview Section */}
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.messagePreview}</span>
              </div>

              {/* Character Count & Segment Warning */}
              <span
                className={`text-[11px] font-semibold ${
                  isMultiPart ? 'text-rose-600' : 'text-amber-800'
                }`}
              >
                {charCount} chars {isMultiPart && '• Warning: >160 chars'}
              </span>
            </div>

            {/* Editable or Static Message */}
            {isManualEditMessage ? (
              <textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                rows={4}
                className="w-full p-2.5 text-xs font-medium border border-amber-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
              />
            ) : (
              <p className="text-xs text-gray-800 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-amber-100 selection:bg-amber-200">
                {generatedMessage}
              </p>
            )}

            {/* Message Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setIsManualEditMessage(!isManualEditMessage)}
                className="text-xs text-[#8B0000] font-bold hover:underline"
              >
                {isManualEditMessage ? '✓ Done Editing' : t.editMessage}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedNotification ? t.copied : t.copy}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareMessage}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                >
                  <Share2 className="w-3 h-3" />
                  <span>{t.share}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 8. Delivery Channel Selector (SMS, WhatsApp, Both) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 tracking-wider uppercase flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-[#8B0000]" />
                <span>{t.sendVia}</span>
              </label>
              <span className="text-[11px] font-semibold text-gray-400">Delivery Channel</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* SMS Button */}
              <button
                type="button"
                onClick={() => setDispatchChannel('SMS')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  dispatchChannel === 'SMS'
                    ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-sm ring-2 ring-red-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                <span>SMS</span>
              </button>

              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={() => setDispatchChannel('WHATSAPP')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  dispatchChannel === 'WHATSAPP'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 flex-shrink-0 text-emerald-300" />
                <span>WhatsApp</span>
              </button>

              {/* Both Button */}
              <button
                type="button"
                onClick={() => setDispatchChannel('BOTH')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  dispatchChannel === 'BOTH'
                    ? 'bg-gradient-to-r from-[#8B0000] to-emerald-600 text-white border-red-800 shadow-sm ring-2 ring-emerald-300 font-extrabold'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="text-xs">⚡ Both</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-500 font-medium">
              {dispatchChannel === 'SMS' && 'Dispatches official Indian Post DLT SMS to the customer.'}
              {dispatchChannel === 'WHATSAPP' && 'Opens WhatsApp chat with customer pre-filled with postal intimation.'}
              {dispatchChannel === 'BOTH' && 'Sends official SMS and triggers WhatsApp message for guaranteed delivery.'}
            </p>
          </div>
        </div>

        {/* Footer Main Send Action Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0 flex gap-2">
          <button
            type="button"
            onClick={handleSaveAsDraft}
            className="py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 active:scale-95 transition-all text-xs flex-shrink-0"
          >
            {t.saveAsDraft}
          </button>

          <button
            type="button"
            id="btn-primary-send-intimation"
            onClick={handleInitiateSend}
            className={`flex-1 active:scale-[0.98] text-white py-3.5 px-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all text-sm tracking-wide uppercase ${
              dispatchChannel === 'WHATSAPP'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
                : dispatchChannel === 'BOTH'
                ? 'bg-gradient-to-r from-[#8B0000] via-red-800 to-emerald-700 hover:brightness-105 shadow-red-900/30'
                : 'bg-[#8B0000] hover:bg-[#740000] shadow-red-900/25'
            }`}
          >
            {dispatchChannel === 'SMS' && <MessageSquare className="w-4 h-4" />}
            {dispatchChannel === 'WHATSAPP' && <MessageCircle className="w-4 h-4" />}
            {dispatchChannel === 'BOTH' && <Send className="w-4 h-4" />}
            <span>
              {dispatchChannel === 'SMS'
                ? t.sendIntimation
                : dispatchChannel === 'WHATSAPP'
                ? t.sendWhatsApp
                : t.sendBoth}
            </span>
          </button>
        </div>
      </div>

      {/* CONFIRM INTIMATION MODAL (Section 13) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight border-b border-gray-100 pb-2">
              {t.confirmIntimation}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 font-medium">{t.customer}:</span>
                <strong className="text-gray-900 uppercase">{customerName}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 font-medium">{t.mobile}:</span>
                <strong className="text-gray-900 font-mono">{maskMobileNumber(mobileNumber)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 font-medium">{t.article}:</span>
                <strong className="text-[#8B0000] font-mono">{articleNumber}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 font-medium">{t.postOffice}:</span>
                <strong className="text-gray-900 truncate max-w-[180px]">{postOffice}</strong>
              </div>

              {/* Delivery Channel Selector in Confirm */}
              <div className="flex justify-between py-1 border-b border-gray-50 items-center">
                <span className="text-gray-500 font-medium">{t.sendVia}:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setDispatchChannel('SMS')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      dispatchChannel === 'SMS'
                        ? 'bg-[#8B0000] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchChannel('WHATSAPP')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      dispatchChannel === 'WHATSAPP'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchChannel('BOTH')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      dispatchChannel === 'BOTH'
                        ? 'bg-gradient-to-r from-[#8B0000] to-emerald-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Both
                  </button>
                </div>
              </div>

              <div className="pt-1.5">
                <span className="text-gray-500 font-medium block mb-1">{t.message}:</span>
                <p className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px] text-gray-800 leading-relaxed font-mono">
                  {generatedMessage}
                </p>
              </div>
            </div>

            {sendErrorReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Delivery Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">{sendErrorReason}</p>
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenSMSApp()}
                    className="flex-1 bg-white border border-rose-300 text-rose-900 font-bold py-1.5 rounded-lg text-xs hover:bg-rose-100"
                  >
                    Open SMS App
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp()}
                    className="flex-1 bg-emerald-600 text-white font-bold py-1.5 rounded-lg text-xs hover:bg-emerald-700"
                  >
                    Open WhatsApp
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isSending}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50"
              >
                {t.cancel}
              </button>

              <button
                type="button"
                disabled={isSending}
                id="btn-confirm-send-now"
                onClick={handleExecuteSend}
                className={`flex-1 text-white py-3 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all ${
                  dispatchChannel === 'WHATSAPP'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
                    : dispatchChannel === 'BOTH'
                    ? 'bg-gradient-to-r from-[#8B0000] to-emerald-700 hover:brightness-105 shadow-red-900/25'
                    : 'bg-[#8B0000] hover:bg-[#740000] shadow-red-900/25'
                }`}
              >
                {isSending ? (
                  <span>{t.sending}</span>
                ) : (
                  <>
                    {dispatchChannel === 'SMS' && <MessageSquare className="w-3.5 h-3.5" />}
                    {dispatchChannel === 'WHATSAPP' && <MessageCircle className="w-3.5 h-3.5" />}
                    {dispatchChannel === 'BOTH' && <Send className="w-3.5 h-3.5" />}
                    <span>
                      {dispatchChannel === 'SMS'
                        ? t.sendNow
                        : dispatchChannel === 'WHATSAPP'
                        ? t.sendWhatsApp
                        : t.sendBoth}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DUPLICATE ARTICLE WARNING MODAL (Section 27) */}
      {showDuplicateModal && duplicateWarningRecord && (
        <div className="fixed inset-0 z-65 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {t.duplicateWarning}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>{articleNumber}</strong> was previously entered on{' '}
              <strong>{duplicateWarningRecord.intimationDate}</strong> for{' '}
              <strong>{duplicateWarningRecord.customerName}</strong>.
            </p>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowDuplicateModal(false);
                  setShowConfirmModal(true);
                }}
                className="w-full py-2.5 bg-[#8B0000] text-white font-bold text-xs rounded-xl hover:bg-[#740000]"
              >
                {t.continueAnyway}
              </button>
              <button
                type="button"
                onClick={() => setShowDuplicateModal(false)}
                className="w-full py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOM ARTICLE TYPE MODAL (Section 6) */}
      {showAddTypeModal && (
        <div className="fixed inset-0 z-65 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">
              Add New Article Type
            </h3>
            <p className="text-xs text-gray-500">
              Enter the name of the new postal item (e.g. AADHAAR CARD, VOTER ID, CREDIT CARD).
            </p>
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value.toUpperCase())}
              placeholder="e.g. AADHAAR CARD"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold uppercase focus:border-[#8B0000] outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddTypeModal(false);
                  setNewTypeName('');
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newTypeName.trim()) {
                    const created = onAddArticleType(newTypeName.trim());
                    setArticleType(created.name);
                    setShowAddTypeModal(false);
                    setNewTypeName('');
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#8B0000] text-white font-bold text-xs hover:bg-[#740000]"
              >
                Add Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS SCREEN (Section 41) */}
      {sendSuccessRecord && (
        <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-lg font-extrabold text-emerald-800 tracking-tight">
              {t.successTitle}
            </h3>

            <div className="bg-gray-50 rounded-2xl p-3.5 text-xs text-left space-y-1.5 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{t.customer}:</span>
                <strong className="text-gray-900">{sendSuccessRecord.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{t.article}:</span>
                <strong className="text-[#8B0000] font-mono">{sendSuccessRecord.articleNumber}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">{t.sendVia}:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    sendSuccessRecord.dispatchChannel === 'WHATSAPP'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sendSuccessRecord.dispatchChannel === 'BOTH'
                      ? 'bg-gradient-to-r from-red-100 to-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-red-100 text-[#8B0000]'
                  }`}
                >
                  {sendSuccessRecord.dispatchChannel === 'BOTH'
                    ? '⚡ SMS + WhatsApp'
                    : sendSuccessRecord.dispatchChannel || 'SMS'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Sent At:</span>
                <span className="text-gray-700 font-medium">
                  {new Date(sendSuccessRecord.sentAt || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Quick Multi-Channel Action Links */}
            <div className="flex gap-2 pt-1">
              <a
                href={`https://api.whatsapp.com/send?phone=91${cleanIndianMobileNumber(sendSuccessRecord.mobileNumber).normalized}&text=${encodeURIComponent(sendSuccessRecord.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`sms:${cleanIndianMobileNumber(sendSuccessRecord.mobileNumber).normalized}?body=${encodeURIComponent(sendSuccessRecord.message)}`}
                className="flex-1 py-2.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>SMS App</span>
              </a>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleResetForm();
                  onClose();
                }}
                className="w-full py-3 bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#740000]"
              >
                {t.done}
              </button>

              <button
                type="button"
                onClick={handleResetForm}
                className="w-full py-3 bg-gray-100 text-gray-800 font-bold text-xs rounded-xl hover:bg-gray-200"
              >
                + New Intimation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
