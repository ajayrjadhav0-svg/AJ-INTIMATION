export type Language = 'en' | 'mr' | 'hi';

export type IntimationStatus =
  | 'DRAFT'
  | 'READY'
  | 'SENT'
  | 'FAILED'
  | 'MANUAL SMS'
  | 'CANCELLED';

export interface ArticleType {
  id: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PostOffice {
  id: string;
  name: string;
  code?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  language: Language;
  template: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Intimation {
  id: string;
  customerName: string;
  mobileNumber: string;
  articleType: string;
  articleNumber: string;
  postOffice: string;
  intimationDate: string; // DD/MM/YYYY
  collectionDays: number;
  message: string;
  status: IntimationStatus;
  createdAt: string;
  sentAt?: string;
  failureReason?: string;
  photoReference?: string;
  userId?: string;
}

export interface PostmanSettings {
  postmanName: string;
  beatArea: string;
  mobileNumber: string;
  defaultPostOffice: string;
  defaultCollectionDays: number;
  language: Language;
  smsProvider: string;
  smsApiKey: string;
  smsSenderId: string;
  smsDltTemplateId: string;
  ocrEnabled: boolean;
  autoCrop: boolean;
  darkMode: boolean;
  offlineMode: boolean;
}

export interface OCRResult {
  addresseeName: string;
  articleNumber: string;
  articleType: string;
  rawText: string;
  detectedConfidence: 'high' | 'medium' | 'low';
}

export interface IntimationStats {
  todayTotal: number;
  sent: number;
  failed: number;
  offline: number;
  manualSms: number;
  drafts: number;
  categoryBreakdown: { [category: string]: number };
}
