import React, { useState } from 'react';
import { X, Upload, AlertCircle, CheckCircle2, FileText, Send, AlertTriangle, Download } from 'lucide-react';
import { Intimation, Language, PostOffice } from '../types';
import { translations, generateSmsMessage } from '../i18n';
import { cleanIndianMobileNumber, generateId, getTodayDateStr } from '../lib/storage';

interface BulkIntimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  defaultPostOffice: string;
  onSaveBulkIntimations: (records: Intimation[]) => void;
}

interface BulkRow {
  id: string;
  mobile: string;
  name: string;
  articleType: string;
  articleNumber: string;
  postOffice: string;
  date: string;
  days: number;
  errors: string[];
  warning?: string;
}

export const BulkIntimationModal: React.FC<BulkIntimationModalProps> = ({
  isOpen,
  onClose,
  language,
  defaultPostOffice,
  onSaveBulkIntimations,
}) => {
  const t = translations[language];

  const [rows, setRows] = useState<BulkRow[]>([]);
  const [isConfirmingSend, setIsConfirmingSend] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const validateRow = (r: Omit<BulkRow, 'errors' | 'warning'>, allRows: Array<{ articleNumber: string }>): BulkRow => {
    const errors: string[] = [];
    let warning: string | undefined;

    const mobVal = cleanIndianMobileNumber(r.mobile);
    if (!mobVal.valid) {
      errors.push('Invalid 10-digit mobile number');
    }

    if (!r.name.trim()) {
      errors.push('Name missing');
    }

    if (!r.articleNumber.trim()) {
      errors.push('Article number missing');
    } else {
      const duplicateCount = allRows.filter((item) => item.articleNumber === r.articleNumber).length;
      if (duplicateCount > 1) {
        warning = 'Duplicate article number in sheet';
      }
    }

    return {
      ...r,
      mobile: mobVal.normalized || r.mobile,
      errors,
      warning,
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (content: string) => {
    const lines = content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length < 2) {
      alert('CSV file appears empty or missing header');
      return;
    }

    // Skip header line
    const rawRows: Array<Omit<BulkRow, 'errors' | 'warning'>> = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
      if (cols.length >= 4) {
        rawRows.push({
          id: `bulk-${i}`,
          mobile: cols[0] || '',
          name: (cols[1] || '').toUpperCase(),
          articleType: (cols[2] || 'SPEED POST').toUpperCase(),
          articleNumber: (cols[3] || '').toUpperCase().replace(/\s/g, ''),
          postOffice: cols[4] || defaultPostOffice,
          date: cols[5] || getTodayDateStr(),
          days: parseInt(cols[6], 10) || 3,
        });
      }
    }

    const validated = rawRows.map((r) => validateRow(r, rawRows));
    setRows(validated);
  };

  const loadDemoBulkData = () => {
    const sampleCSV = `MOBILE NUMBER,NAME,ARTICLE TYPE,ARTICLE NUMBER,POST OFFICE,DATE,DAYS
9820112233,SANDEEP PATIL,PAN CARD,TA452109871IN,Kalwa Post Office (#400605),15/09/2026,3
9819445566,POOJA SAWANT,DRIVING LICENSE,DL890123456IN,Kalwa Post Office (#400605),15/09/2026,3
9769778899,AMIT GUPTA,SPEED POST,EA567890123IN,Kalwa Post Office (#400605),15/09/2026,3
9820334455,KISHORE JAIN,PARCEL,CP123456780IN,Kalwa Post Office (#400605),15/09/2026,5`;
    parseCSV(sampleCSV);
  };

  const hasErrors = rows.some((r) => r.errors.length > 0);

  const handleSendAll = async () => {
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 800));

    const recordsToSave: Intimation[] = rows.map((r) => {
      const msg = generateSmsMessage({
        name: r.name,
        articleType: r.articleType,
        postOffice: r.postOffice,
        articleNumber: r.articleNumber,
        days: r.days,
        date: r.date,
        language,
      });

      return {
        id: generateId(),
        customerName: r.name,
        mobileNumber: r.mobile,
        articleType: r.articleType,
        articleNumber: r.articleNumber,
        postOffice: r.postOffice,
        intimationDate: r.date,
        collectionDays: r.days,
        message: msg,
        status: 'SENT',
        createdAt: new Date().toISOString(),
        sentAt: new Date().toISOString(),
      };
    });

    onSaveBulkIntimations(recordsToSave);
    setIsSending(false);
    setIsConfirmingSend(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#8B0000] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold uppercase tracking-tight">{t.bulkIntimation}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {rows.length === 0 ? (
            <div className="space-y-4 text-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-50 text-[#8B0000] flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{t.bulkUploadNotice}</h4>
                <p className="text-gray-500 text-xs mt-1 max-w-xs mx-auto">
                  Format: Mobile, Name, Article Type, Article Number, Post Office, Date, Days
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <label className="px-4 py-2.5 bg-[#8B0000] text-white font-bold rounded-xl cursor-pointer hover:bg-[#740000] active:scale-95 transition-all">
                  Choose CSV File
                  <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                </label>

                <button
                  type="button"
                  onClick={loadDemoBulkData}
                  className="px-4 py-2.5 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200"
                >
                  Load Demo CSV
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">
                  {rows.length} rows loaded ({rows.filter((r) => r.errors.length === 0).length} valid)
                </span>
                <button
                  type="button"
                  onClick={() => setRows([])}
                  className="text-xs text-[#8B0000] font-bold hover:underline"
                >
                  Upload Different File
                </button>
              </div>

              {/* Rows preview list */}
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-72 overflow-y-auto">
                {rows.map((row, idx) => (
                  <div
                    key={row.id}
                    className={`p-2.5 flex items-center justify-between text-xs ${
                      row.errors.length > 0 ? 'bg-rose-50/70' : row.warning ? 'bg-amber-50/70' : 'bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 uppercase">{row.name}</span>
                        <span className="font-mono text-gray-500">{row.mobile}</span>
                      </div>
                      <div className="text-[11px] font-mono text-[#8B0000] font-semibold">
                        {row.articleNumber} • {row.articleType}
                      </div>

                      {row.errors.length > 0 && (
                        <div className="text-rose-600 font-semibold text-[10px] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{row.errors.join(', ')}</span>
                        </div>
                      )}

                      {row.warning && (
                        <div className="text-amber-700 font-semibold text-[10px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{row.warning}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      {row.errors.length === 0 ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                          ✕
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {rows.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 text-xs hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={hasErrors || isSending}
              onClick={() => setIsConfirmingSend(true)}
              className="px-5 py-2.5 rounded-xl bg-[#8B0000] text-white font-bold text-xs shadow-md hover:bg-[#740000] disabled:opacity-40 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send All ({rows.filter((r) => r.errors.length === 0).length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmingSend && (
        <div className="fixed inset-0 z-70 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <h4 className="font-bold text-gray-900 text-base">Confirm Bulk Intimations</h4>
            <p className="text-xs text-gray-600">
              Are you sure you want to dispatch {rows.filter((r) => r.errors.length === 0).length} intimations via the DLT Postal SMS Gateway?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isSending}
                onClick={() => setIsConfirmingSend(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={handleSendAll}
                className="flex-1 py-2.5 rounded-xl bg-[#8B0000] text-white font-bold text-xs hover:bg-[#740000]"
              >
                {isSending ? 'Sending...' : 'Confirm & Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
