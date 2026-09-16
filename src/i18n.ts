import { Language } from './types';

export interface Translations {
  appName: string;
  tagline: string;
  postBadge: string;
  online: string;
  offline: string;
  todayIntimations: string;
  dltPortalSync: string;
  sent: string;
  failed: string;
  offlineDrafts: string;
  pending: string;
  manualSms: string;
  newIntimation: string;
  fastDispatch: string;
  scanArticle: string;
  scanSub: string;
  recordsLog: string;
  recordsSub: string;
  dailyBreakdown: string;
  quickDemo: string;
  speedPost: string;
  regdLetters: string;
  courierDl: string;
  home: string;
  intimateNav: string;
  scanNav: string;
  historyNav: string;
  customerMobile: string;
  mobilePlaceholder: string;
  addresseeName: string;
  namePlaceholder: string;
  articleType: string;
  addNewArticleType: string;
  articleNumber: string;
  articlePlaceholder: string;
  postOffice: string;
  intimationDate: string;
  collectWithin: string;
  days: string;
  day: string;
  messagePreview: string;
  editMessage: string;
  copy: string;
  copied: string;
  share: string;
  sendIntimation: string;
  sending: string;
  confirmIntimation: string;
  cancel: string;
  sendNow: string;
  customer: string;
  mobile: string;
  article: string;
  message: string;
  successTitle: string;
  done: string;
  repeatIntimation: string;
  openSmsApp: string;
  saveAsDraft: string;
  retry: string;
  searchPlaceholder: string;
  filterByStatus: string;
  all: string;
  exportCsv: string;
  exportExcel: string;
  settings: string;
  duplicateWarning: string;
  viewPrevious: string;
  continueAnyway: string;
  aiDetectedInfo: string;
  useDetails: string;
  edit: string;
  retakePhoto: string;
  verifyNotice: string;
  openGoogleLens: string;
  bulkIntimation: string;
  bulkUploadNotice: string;
  sendAll: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'INTIMATION',
    tagline: 'Quick Postal SMS Intimator',
    postBadge: 'POST',
    online: 'ONLINE',
    offline: 'OFFLINE',
    todayIntimations: "TODAY'S INTIMATIONS",
    dltPortalSync: 'DLT Portal Sync Active',
    sent: 'Sent',
    failed: 'Failed',
    offlineDrafts: 'Offline',
    pending: 'Pending',
    manualSms: 'Manual SMS',
    newIntimation: '+ NEW INTIMATION',
    fastDispatch: 'Fast dispatch in 15-20 seconds',
    scanArticle: 'SCAN ARTICLE',
    scanSub: 'OCR barcode & address slip',
    recordsLog: 'RECORDS LOG',
    recordsSub: 'Search dispatched items',
    dailyBreakdown: 'DAILY CATEGORY BREAKDOWN',
    quickDemo: 'Demo Data',
    speedPost: 'Speed Post',
    regdLetters: 'Regd Letters',
    courierDl: 'Courier / DL',
    home: 'Home',
    intimateNav: '+ Intimate',
    scanNav: 'Scan',
    historyNav: 'History',
    customerMobile: 'CUSTOMER MOBILE NUMBER',
    mobilePlaceholder: 'Enter 10-digit mobile number',
    addresseeName: 'ADDRESSEE NAME',
    namePlaceholder: 'Enter customer name',
    articleType: 'ARTICLE TYPE',
    addNewArticleType: '+ ADD NEW ARTICLE TYPE',
    articleNumber: 'ARTICLE NUMBER',
    articlePlaceholder: 'Enter article number (e.g. TA123456789IN)',
    postOffice: 'POST OFFICE',
    intimationDate: 'INTIMATION DATE',
    collectWithin: 'COLLECT WITHIN',
    days: 'Days',
    day: 'Day',
    messagePreview: 'MESSAGE PREVIEW',
    editMessage: 'EDIT MESSAGE',
    copy: 'COPY',
    copied: 'COPIED!',
    share: 'SHARE',
    sendIntimation: 'SEND INTIMATION',
    sending: 'SENDING...',
    confirmIntimation: 'CONFIRM INTIMATION',
    cancel: 'CANCEL',
    sendNow: 'SEND NOW',
    customer: 'Customer',
    mobile: 'Mobile',
    article: 'Article',
    message: 'Message',
    successTitle: '✓ INTIMATION SENT SUCCESSFULLY',
    done: 'DONE',
    repeatIntimation: 'REPEAT INTIMATION',
    openSmsApp: 'OPEN SMS APP',
    saveAsDraft: 'SAVE AS DRAFT',
    retry: 'RETRY',
    searchPlaceholder: 'Search by customer, mobile, or article...',
    filterByStatus: 'Filter Status',
    all: 'All',
    exportCsv: 'EXPORT CSV',
    exportExcel: 'EXPORT EXCEL',
    settings: 'SETTINGS',
    duplicateWarning: 'ARTICLE NUMBER ALREADY EXISTS',
    viewPrevious: 'VIEW PREVIOUS RECORD',
    continueAnyway: 'CONTINUE ANYWAY',
    aiDetectedInfo: 'AI DETECTED INFORMATION',
    useDetails: 'USE THESE DETAILS',
    edit: 'EDIT',
    retakePhoto: 'RETAKE PHOTO',
    verifyNotice: 'Please verify the information before continuing.',
    openGoogleLens: 'OPEN WITH GOOGLE LENS',
    bulkIntimation: 'BULK INTIMATION',
    bulkUploadNotice: 'Upload CSV or Excel file containing postal articles',
    sendAll: 'SEND ALL',
  },
  mr: {
    appName: 'सूचना',
    tagline: 'जलद टपाल वितरण सूचना',
    postBadge: 'डाक',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    todayIntimations: 'आजच्या सूचना',
    dltPortalSync: 'DLT पोर्टल सिंक सुरू',
    sent: 'पाठवले',
    failed: 'अयशस्वी',
    offlineDrafts: 'ऑफलाइन',
    pending: 'प्रलंबित',
    manualSms: 'मॅन्युअल SMS',
    newIntimation: '+ नवीन सूचना',
    fastDispatch: '१५-२० सेकंदात जलद पाठवा',
    scanArticle: 'आर्टिकल स्कॅन करा',
    scanSub: 'OCR बारकोड व पत्ता स्लिप',
    recordsLog: 'नोंदणी वही',
    recordsSub: 'पाठवलेले आर्टिकल शोधा',
    dailyBreakdown: 'दैनिक प्रवर्ग वर्गीकरण',
    quickDemo: 'डेमो डेटा',
    speedPost: 'स्पीड पोस्ट',
    regdLetters: 'नोंदणीकृत पत्रे',
    courierDl: 'कुरिअर / DL',
    home: 'मुख्य',
    intimateNav: '+ सूचना',
    scanNav: 'स्कॅन',
    historyNav: 'इतिहास',
    customerMobile: 'ग्राहकाचा मोबाईल नंबर',
    mobilePlaceholder: '१० अंकी मोबाईल नंबर टाका',
    addresseeName: 'ग्राहकाचे नाव',
    namePlaceholder: 'ग्राहकाचे पूर्ण नाव टाका',
    articleType: 'आर्टिकल प्रकार',
    addNewArticleType: '+ नवीन प्रकार जोडा',
    articleNumber: 'आर्टिकल नंबर',
    articlePlaceholder: 'आर्टिकल नंबर टाका (उदा. TA123456789IN)',
    postOffice: 'पोस्ट ऑफिस',
    intimationDate: 'सूचना दिनांक',
    collectWithin: 'मुदत',
    days: 'दिवस',
    day: 'दिवस',
    messagePreview: 'संदेश पूर्वावलोकन',
    editMessage: 'संदेश संपादित करा',
    copy: 'कॉपी',
    copied: 'कॉपी झाले!',
    share: 'शेअर',
    sendIntimation: 'सूचना पाठवा',
    sending: 'पाठवत आहे...',
    confirmIntimation: 'सूचनेची पुष्टी करा',
    cancel: 'रद्द करा',
    sendNow: 'आत्ता पाठवा',
    customer: 'ग्राहक',
    mobile: 'मोबाईल',
    article: 'आर्टिकल',
    message: 'संदेश',
    successTitle: '✓ सूचना यशस्वीरीत्या पाठवली',
    done: 'पूर्ण',
    repeatIntimation: 'पुन्हा पाठवा',
    openSmsApp: 'SMS ॲप उघडा',
    saveAsDraft: 'मसुदा सेव्ह करा',
    retry: 'पुन्हा प्रयत्न करा',
    searchPlaceholder: 'ग्राहक, मोबाईल किंवा आर्टिकल नंबर शोधा...',
    filterByStatus: 'स्थितीनुसार फिल्टर',
    all: 'सर्व',
    exportCsv: 'CSV निर्यात',
    exportExcel: 'Excel निर्यात',
    settings: 'सेटिंग्ज',
    duplicateWarning: 'हा आर्टिकल नंबर आधीच नोंदवला आहे',
    viewPrevious: 'मागील नोंद पाहा',
    continueAnyway: 'पुढे सुरू ठेवा',
    aiDetectedInfo: 'AI द्वारे शोधलेली माहिती',
    useDetails: 'ही माहिती वापरा',
    edit: 'बदल करा',
    retakePhoto: 'पुन्हा फोटो घ्या',
    verifyNotice: 'कृपया पुढे जाण्यापूर्वी माहितीची खात्री करा.',
    openGoogleLens: 'Google Lens सह उघडा',
    bulkIntimation: 'एकत्रित सूचना (Bulk)',
    bulkUploadNotice: 'CSV किंवा Excel फाईल अपलोड करा',
    sendAll: 'सर्व पाठवा',
  },
  hi: {
    appName: 'सूचना',
    tagline: 'त्वरित डाक वितरण सूचना',
    postBadge: 'डाक',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    todayIntimations: 'आज की सूचनाएं',
    dltPortalSync: 'DLT पोर्टल सिंक सक्रिय',
    sent: 'भेजे गए',
    failed: 'विफल',
    offlineDrafts: 'ऑफलाइन',
    pending: 'लंबित',
    manualSms: 'मैन्युअल SMS',
    newIntimation: '+ नई सूचना',
    fastDispatch: '15-20 सेकंड में त्वरित डिस्पैच',
    scanArticle: 'आर्टिकल स्कैन करें',
    scanSub: 'OCR बारकोड और पता पर्ची',
    recordsLog: 'रिकॉर्ड लॉग',
    recordsSub: 'भेजे गए आर्टिकल खोजें',
    dailyBreakdown: 'दैनिक श्रेणी विवरण',
    quickDemo: 'डेमो डेटा',
    speedPost: 'स्पीड पोस्ट',
    regdLetters: 'पंजीकृत पत्र',
    courierDl: 'कूरियर / DL',
    home: 'होम',
    intimateNav: '+ सूचना',
    scanNav: 'स्कैन',
    historyNav: 'इतिहास',
    customerMobile: 'ग्राहक मोबाइल नंबर',
    mobilePlaceholder: '10 अंकों का मोबाइल नंबर दर्ज करें',
    addresseeName: 'पाने वाले का नाम',
    namePlaceholder: 'ग्राहक का पूरा नाम दर्ज करें',
    articleType: 'आर्टिकल प्रकार',
    addNewArticleType: '+ नया आर्टिकल प्रकार जोड़ें',
    articleNumber: 'आर्टिकल नंबर',
    articlePlaceholder: 'आर्टिकल नंबर दर्ज करें (जैसे TA123456789IN)',
    postOffice: 'डाकघर (Post Office)',
    intimationDate: 'सूचना दिनांक',
    collectWithin: 'संग्रहण अवधि',
    days: 'दिन',
    day: 'दिन',
    messagePreview: 'संदेश पूर्वावलोकन',
    editMessage: 'संदेश संपादित करें',
    copy: 'कॉपी',
    copied: 'कॉपी हो गया!',
    share: 'शेयर',
    sendIntimation: 'सूचना भेजें',
    sending: 'भेजा जा रहा है...',
    confirmIntimation: 'सूचना की पुष्टि करें',
    cancel: 'रद्द करें',
    sendNow: 'अभी भेजें',
    customer: 'ग्राहक',
    mobile: 'मोबाइल',
    article: 'आर्टिकल',
    message: 'संदेश',
    successTitle: '✓ सूचना सफलतापूर्वक भेजी गई',
    done: 'संपन्न',
    repeatIntimation: 'पुनः सूचना भेजें',
    openSmsApp: 'SMS ऐप खोलें',
    saveAsDraft: 'ड्राफ्ट सहेजें',
    retry: 'पुनः प्रयास करें',
    searchPlaceholder: 'ग्राहक, मोबाइल या आर्टिकल नंबर खोजें...',
    filterByStatus: 'स्थिति अनुसार फ़िल्टर',
    all: 'सभी',
    exportCsv: 'CSV निर्यात',
    exportExcel: 'Excel निर्यात',
    settings: 'सेटिंग्स',
    duplicateWarning: 'यह आर्टिकल नंबर पहले से मौजूद है',
    viewPrevious: 'पिछला रिकॉर्ड देखें',
    continueAnyway: 'जारी रखें',
    aiDetectedInfo: 'AI द्वारा पहचानी गई जानकारी',
    useDetails: 'यह विवरण उपयोग करें',
    edit: 'संशोधित करें',
    retakePhoto: 'पुनः फोटो लें',
    verifyNotice: 'कृपया आगे बढ़ने से पहले विवरण सत्यापित करें।',
    openGoogleLens: 'Google Lens से खोलें',
    bulkIntimation: 'सामूहिक सूचना (Bulk)',
    bulkUploadNotice: 'CSV या Excel फाइल अपलोड करें',
    sendAll: 'सभी भेजें',
  },
};

export function generateSmsMessage(params: {
  name: string;
  articleType: string;
  postOffice: string;
  articleNumber: string;
  days: number;
  date: string;
  language?: Language;
}): string {
  const { name, articleType, postOffice, articleNumber, days, date, language = 'en' } = params;
  const cleanName = (name || 'CUSTOMER').toUpperCase().trim();
  const cleanArticleType = (articleType || 'ARTICLE').toUpperCase().trim();
  const cleanPostOffice = (postOffice || 'POST OFFICE').toUpperCase().trim();
  const cleanArticleNumber = (articleNumber || '').toUpperCase().trim();
  const daysText = `${days} ${days === 1 ? 'DAY' : 'DAYS'}`;

  if (language === 'mr') {
    return `${cleanName}, कृपया आपले ${cleanArticleType} पोस्ट ऑफिस ${cleanPostOffice} येथून आर्टिकल क्रमांक ${cleanArticleNumber} सह ${days} दिवसांच्या आत घेऊन जावे. सूचना दिनांक: ${date}.`;
  }

  if (language === 'hi') {
    return `${cleanName}, कृपया अपना ${cleanArticleType} डाकघर ${cleanPostOffice} से आर्टिकल नंबर ${cleanArticleNumber} सहित ${days} दिनों के भीतर प्राप्त करें। सूचना दिनांक: ${date}.`;
  }

  // Default English as specified in prompt section 11
  return `${cleanName}, PLEASE COLLECT YOUR ${cleanArticleType} FROM ${cleanPostOffice} WITH ARTICLE NUMBER ${cleanArticleNumber} WITHIN ${daysText}. INTIMATION DATE: ${date}.`;
}
