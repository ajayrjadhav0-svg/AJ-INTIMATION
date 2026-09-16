import { ArticleType, Intimation, Language, PostmanSettings, PostOffice } from '../types';

export const DEFAULT_ARTICLE_TYPES: string[] = [
  'PAN CARD',
  'DRIVING LICENSE',
  'RC BOOK',
  'ATM',
  'CHEQUE BOOK',
  'LETTERS',
  'PARCEL',
  'SPEED POST',
  'REGD POST',
  'PASSPORT',
];

export const DEFAULT_POST_OFFICES: PostOffice[] = [
  {
    id: 'po-1',
    name: 'Kalwa Post Office (#400605)',
    code: '400605',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'po-2',
    name: 'Thane Head Post Office (#400601)',
    code: '400601',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'po-3',
    name: 'Mulund West Post Office (#400080)',
    code: '400080',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'po-4',
    name: 'Dombivli Post Office (#421201)',
    code: '421201',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_SETTINGS: PostmanSettings = {
  postmanName: 'Ajay Jadhav',
  beatArea: 'Beat 04',
  mobileNumber: '9876543210',
  defaultPostOffice: 'Kalwa Post Office (#400605)',
  defaultCollectionDays: 3,
  language: 'en',
  smsProvider: 'DLT Indian Postal Gateway (BSNL / CDAC / Airtel)',
  smsApiKey: 'DEMO_DLT_KEY_SECURE',
  smsSenderId: 'INDPOST',
  smsDltTemplateId: '1407161234567890123',
  ocrEnabled: true,
  autoCrop: true,
  darkMode: false,
  offlineMode: false,
};

export function getTodayDateStr(): string {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  return `${d}/${m}/${y}`;
}

export function cleanIndianMobileNumber(raw: string): { valid: boolean; normalized: string; error?: string } {
  let cleaned = raw.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  if (cleaned.length === 0) {
    return { valid: false, normalized: '', error: 'Please enter a 10-digit mobile number' };
  }

  if (cleaned.length !== 10) {
    return { valid: false, normalized: cleaned, error: 'Mobile number must be exactly 10 digits' };
  }

  if (!/^[6-9]/.test(cleaned)) {
    return { valid: false, normalized: cleaned, error: 'Indian mobile number must start with 6, 7, 8, or 9' };
  }

  return { valid: true, normalized: cleaned };
}

export function maskMobileNumber(num: string): string {
  if (num.length === 10) {
    return `${num.slice(0, 2)}XXXXXX${num.slice(8)}`;
  }
  return num;
}

export function generateId(): string {
  return 'INT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// Generate realistic seed records matching the screenshot (25 total: 22 Sent, 2 Failed, 1 Offline)
export function createInitialSeedIntimations(): Intimation[] {
  const today = getTodayDateStr();
  const types = [
    { type: 'PAN CARD', count: 6 },
    { type: 'DRIVING LICENSE', count: 5 },
    { type: 'ATM', count: 3 },
    { type: 'SPEED POST', count: 7 },
    { type: 'LETTERS', count: 4 },
  ];

  const names = [
    'AJAY JADHAV', 'SUNIL SHINDE', 'PRIYA DESHMUKH', 'ROHIT KULKARNI', 'ANITA PATIL',
    'RAMESH CHAVAN', 'DEEPAK MORE', 'KAVITA PAWAR', 'SANJAY JOSHI', 'SNEHA MANE',
    'VIKRAM SALVI', 'NEHA BHAGAT', 'AMIT THAKUR', 'POOJA GAIKWAD', 'RAKESH SAWANT',
    'ARCHANA MHATRE', 'MAHESH KADAM', 'PRATIK BHOIR', 'MEENA SHARMA', 'KISHORE GUPTA',
    'SWATI NAIR', 'PRAMOD RANE', 'GANESH KAMBLE', 'SARITA YADAV', 'DINESH TANDEL'
  ];

  const intimations: Intimation[] = [];
  let index = 0;

  types.forEach(group => {
    for (let i = 0; i < group.count; i++) {
      const name = names[index % names.length];
      const mobile = `98${Math.floor(10000000 + Math.random() * 89999999).toString().slice(0, 8)}`;
      const prefix = group.type === 'SPEED POST' ? 'EA' : (group.type === 'LETTERS' ? 'RA' : 'TA');
      const articleNum = `${prefix}${Math.floor(100000000 + Math.random() * 899999999)}IN`;
      
      let status: Intimation['status'] = 'SENT';
      let failureReason: string | undefined;
      
      if (index === 23) {
        status = 'FAILED';
        failureReason = 'Customer mobile switched off / network error';
      } else if (index === 24) {
        status = 'FAILED';
        failureReason = 'SMS gateway DLT response timeout';
      } else if (index === 22) {
        status = 'DRAFT';
      }

      intimations.push({
        id: `DEMO-${index + 1}`,
        customerName: name,
        mobileNumber: mobile,
        articleType: group.type,
        articleNumber: articleNum,
        postOffice: 'Kalwa Post Office (#400605)',
        intimationDate: today,
        collectionDays: 3,
        message: `${name}, PLEASE COLLECT YOUR ${group.type} FROM KALWA POST OFFICE (#400605) WITH ARTICLE NUMBER ${articleNum} WITHIN 3 DAYS. INTIMATION DATE: ${today}.`,
        status,
        createdAt: new Date(Date.now() - (index * 14 * 60 * 1000)).toISOString(),
        sentAt: status === 'SENT' ? new Date(Date.now() - (index * 14 * 60 * 1000) + 2000).toISOString() : undefined,
        failureReason,
      });

      index++;
    }
  });

  return intimations;
}

const STORAGE_KEYS = {
  INTIMATIONS: 'intimation_records_v1',
  ARTICLE_TYPES: 'intimation_article_types_v1',
  POST_OFFICES: 'intimation_post_offices_v1',
  SETTINGS: 'intimation_settings_v1',
  RECENT_MOBILES: 'intimation_recent_mobiles_v1',
};

export const StorageService = {
  getIntimations(): Intimation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INTIMATIONS);
      if (!data) {
        const initial = createInitialSeedIntimations();
        localStorage.setItem(STORAGE_KEYS.INTIMATIONS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return createInitialSeedIntimations();
    }
  },

  saveIntimations(records: Intimation[]) {
    localStorage.setItem(STORAGE_KEYS.INTIMATIONS, JSON.stringify(records));
  },

  addIntimation(record: Intimation): Intimation {
    const records = this.getIntimations();
    // Add to beginning of array
    const updated = [record, ...records];
    this.saveIntimations(updated);
    this.addRecentMobile(record.mobileNumber);
    return record;
  },

  updateIntimation(id: string, partial: Partial<Intimation>): Intimation | null {
    const records = this.getIntimations();
    const idx = records.findIndex(r => r.id === id);
    if (idx === -1) return null;
    records[idx] = { ...records[idx], ...partial };
    this.saveIntimations(records);
    return records[idx];
  },

  deleteIntimation(id: string) {
    const records = this.getIntimations().filter(r => r.id !== id);
    this.saveIntimations(records);
  },

  findDuplicateArticle(articleNumber: string): Intimation | undefined {
    const normalized = articleNumber.trim().toUpperCase();
    if (!normalized) return undefined;
    const records = this.getIntimations();
    return records.find(r => r.articleNumber.trim().toUpperCase() === normalized);
  },

  getArticleTypes(): ArticleType[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARTICLE_TYPES);
      if (!data) {
        const initial: ArticleType[] = DEFAULT_ARTICLE_TYPES.map((name, i) => ({
          id: `at-${i + 1}`,
          name,
          isDefault: true,
          isActive: true,
          createdAt: new Date().toISOString(),
        }));
        localStorage.setItem(STORAGE_KEYS.ARTICLE_TYPES, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ARTICLE_TYPES.map((name, i) => ({
        id: `at-${i + 1}`,
        name,
        isDefault: true,
        isActive: true,
        createdAt: new Date().toISOString(),
      }));
    }
  },

  saveArticleTypes(types: ArticleType[]) {
    localStorage.setItem(STORAGE_KEYS.ARTICLE_TYPES, JSON.stringify(types));
  },

  addArticleType(name: string): ArticleType {
    const types = this.getArticleTypes();
    const cleanName = name.trim().toUpperCase();
    const existing = types.find(t => t.name === cleanName);
    if (existing) return existing;
    const newType: ArticleType = {
      id: `at-custom-${Date.now()}`,
      name: cleanName,
      isDefault: false,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    this.saveArticleTypes([...types, newType]);
    return newType;
  },

  getPostOffices(): PostOffice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POST_OFFICES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.POST_OFFICES, JSON.stringify(DEFAULT_POST_OFFICES));
        return DEFAULT_POST_OFFICES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_POST_OFFICES;
    }
  },

  savePostOffices(pos: PostOffice[]) {
    localStorage.setItem(STORAGE_KEYS.POST_OFFICES, JSON.stringify(pos));
  },

  addPostOffice(name: string, code?: string, setAsDefault: boolean = false): PostOffice {
    let pos = this.getPostOffices();
    if (setAsDefault) {
      pos = pos.map(p => ({ ...p, isDefault: false }));
    }
    const newPo: PostOffice = {
      id: `po-${Date.now()}`,
      name: name.trim(),
      code: code?.trim(),
      isDefault: setAsDefault || pos.length === 0,
      createdAt: new Date().toISOString(),
    };
    this.savePostOffices([...pos, newPo]);
    return newPo;
  },

  getSettings(): PostmanSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: PostmanSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getRecentMobiles(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_MOBILES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecentMobile(mobile: string) {
    if (!mobile || mobile.length !== 10) return;
    const current = this.getRecentMobiles().filter(m => m !== mobile);
    const updated = [mobile, ...current].slice(0, 6);
    localStorage.setItem(STORAGE_KEYS.RECENT_MOBILES, JSON.stringify(updated));
  },

  getLanguage(): Language {
    try {
      const l = localStorage.getItem('intimation_language');
      return (l as Language) || 'en';
    } catch {
      return 'en';
    }
  },

  saveLanguage(lang: Language) {
    localStorage.setItem('intimation_language', lang);
  },

  saveIntimation(record: Intimation): Intimation {
    return this.addIntimation(record);
  },

  saveBulkIntimations(records: Intimation[]) {
    const existing = this.getIntimations();
    const updated = [...records, ...existing];
    this.saveIntimations(updated);
  },

  resetDemoData(): Intimation[] {
    const initial = createInitialSeedIntimations();
    localStorage.setItem(STORAGE_KEYS.INTIMATIONS, JSON.stringify(initial));
    return initial;
  },

  clearAll() {
    this.clearAllData();
  },

  resetToDemoData() {
    const initial = createInitialSeedIntimations();
    localStorage.setItem(STORAGE_KEYS.INTIMATIONS, JSON.stringify(initial));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  },

  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.INTIMATIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.RECENT_MOBILES);
    localStorage.removeItem(STORAGE_KEYS.ARTICLE_TYPES);
    localStorage.removeItem(STORAGE_KEYS.POST_OFFICES);
  }
};
