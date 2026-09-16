import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Copy,
  Share2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Smartphone,
  ExternalLink,
  Clock,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Intimation, Language } from '../types';
import { translations } from '../i18n';
import { maskMobileNumber } from '../lib/storage';

interface HistoryViewProps {
  intimations: Intimation[];
  language: Language;
  onRepeatIntimation: (record: Intimation) => void;
  onRetrySend?: (record: Intimation) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  intimations,
  language,
  onRepeatIntimation,
  onRetrySend,
}) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedArticleType, setSelectedArticleType] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique article types from records
  const uniqueArticleTypes = useMemo(() => {
    const types = new Set<string>();
    intimations.forEach((i) => {
      if (i.articleType) types.add(i.articleType);
    });
    return Array.from(types);
  }, [intimations]);

  // Filter intimations
  const filteredRecords = useMemo(() => {
    return intimations.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.customerName.toLowerCase().includes(q) ||
        item.mobileNumber.includes(q) ||
        item.articleNumber.toLowerCase().includes(q) ||
        item.postOffice.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === 'ALL' || item.status === selectedStatus;

      const matchesType =
        selectedArticleType === 'ALL' || item.articleType === selectedArticleType;

      return matchesQuery && matchesStatus && matchesType;
    });
  }, [intimations, searchQuery, selectedStatus, selectedArticleType]);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Customer Name',
      'Mobile Number',
      'Article Type',
      'Article Number',
      'Post Office',
      'Intimation Date',
      'Collection Days',
      'Status',
      'Created At',
      'Sent At',
      'Failure Reason',
      'Message',
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${r.customerName}"`,
      `"${r.mobileNumber}"`,
      `"${r.articleType}"`,
      `"${r.articleNumber}"`,
      `"${r.postOffice}"`,
      `"${r.intimationDate}"`,
      `"${r.collectionDays}"`,
      `"${r.status}"`,
      `"${r.createdAt}"`,
      `"${r.sentAt || ''}"`,
      `"${r.failureReason || ''}"`,
      `"${r.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `postal_intimations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: Intimation['status']) => {
    switch (status) {
      case 'SENT':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            SENT
          </span>
        );
      case 'FAILED':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            FAILED
          </span>
        );
      case 'MANUAL SMS':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            MANUAL SMS
          </span>
        );
      case 'DRAFT':
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            DRAFT
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-28 text-gray-800">
      {/* Header & Export Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">
            {t.recordsLog}
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            {filteredRecords.length} records found
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-xs font-semibold focus:border-[#8B0000] outline-none transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Filter Tabs / Selectors */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', 'SENT', 'FAILED', 'MANUAL SMS', 'DRAFT'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-all border ${
              selectedStatus === st
                ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Article Type Filter if multiple exist */}
      {uniqueArticleTypes.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Article:</span>
          <select
            value={selectedArticleType}
            onChange={(e) => setSelectedArticleType(e.target.value)}
            className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none"
          >
            <option value="ALL">All Article Types</option>
            {uniqueArticleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200 space-y-2">
            <Clock className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs font-semibold text-gray-500">No intimations found matching your criteria</p>
          </div>
        ) : (
          filteredRecords.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow space-y-2.5 text-xs"
            >
              {/* Row 1: Customer Name, Status Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 uppercase text-sm tracking-tight">
                    {item.customerName}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-500 text-[11px] font-mono mt-0.5">
                    <span>{maskMobileNumber(item.mobileNumber)}</span>
                    <span>•</span>
                    <span>{item.intimationDate}</span>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              {/* Row 2: Article Info */}
              <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                    {item.articleType}
                  </span>
                  <span className="font-mono font-bold text-[#8B0000] text-xs tracking-wider">
                    {item.articleNumber}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-medium">Post Office</span>
                  <span className="text-[11px] font-semibold text-gray-700 truncate max-w-[150px] inline-block">
                    {item.postOffice.split('(')[0]}
                  </span>
                </div>
              </div>

              {/* Row 3: Failure Reason if present */}
              {item.failureReason && (
                <div className="bg-rose-50 border border-rose-100 p-2 rounded-xl text-[11px] text-rose-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  <span>{item.failureReason}</span>
                </div>
              )}

              {/* Row 4: Action Buttons (Repeat, Copy, Share) */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                {/* Repeat Intimation button (Section 26 requirement) */}
                <button
                  type="button"
                  onClick={() => onRepeatIntimation(item)}
                  className="px-2.5 py-1.5 bg-red-50 text-[#8B0000] rounded-lg font-bold text-xs hover:bg-red-100 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.repeatIntimation}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(item.id, item.message)}
                    className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copy SMS Message"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: 'Postal Intimation', text: item.message }).catch(() => {});
                      } else {
                        handleCopyMessage(item.id, item.message);
                      }
                    }}
                    className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Share Message"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
