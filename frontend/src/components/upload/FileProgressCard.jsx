import React from 'react';
import { FileText, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const FileProgressCard = ({ file, step = 5, status = 'Done' }) => {
  // Steps: 1: Uploading, 2: Reading, 3: Classifying, 4: Extracting, 5: Validating, 6: Done
  const steps = [
    { num: 1, label: 'Uploading' },
    { num: 2, label: 'Reading / OCR' },
    { num: 3, label: 'Classifying' },
    { num: 4, label: 'Extracting' },
    { num: 5, label: 'Validating' },
    { num: 6, label: 'Done' },
  ];

  return (
    <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm transition-all">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-text-light dark:text-text-dark truncate">
              {file.fileName || file.name}
            </h4>
            <span className="text-[11px] text-text-mutedLight dark:text-text-mutedDark">
              {file.size || (file.fileSize ? `${Math.round(file.fileSize / 1024)} KB` : '120 KB')} • {file.type || 'Document'}
            </span>
          </div>
        </div>

        {/* Memory wiped badge */}
        <Badge variant="success" size="sm" icon={ShieldCheck}>
          Buffer Expunged
        </Badge>
      </div>

      {/* Stepped progress bar */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-6 gap-1">
          {steps.map((s) => {
            const isCompleted = step >= s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex flex-col gap-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-teal-500'
                      : isCurrent
                      ? 'bg-teal-400 animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
                <span
                  className={`text-[9px] truncate text-center hidden sm:block ${
                    isCompleted
                      ? 'text-teal-600 dark:text-teal-400 font-semibold'
                      : 'text-text-mutedLight dark:text-text-mutedDark'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
