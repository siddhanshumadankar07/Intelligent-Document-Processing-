import React, { useState, useRef } from 'react';
import { UploadCloud, FileUp, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';

export const Dropzone = ({ onFilesSelected, onSelectSample, isUploading = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 ${
        isDragOver
          ? 'border-primary bg-primary/5 dark:bg-primary/10 scale-[1.01] privacy-glow'
          : 'border-slate-300 dark:border-slate-700 bg-surface-light/60 dark:bg-surface-dark/60 hover:border-slate-400 dark:hover:border-slate-600'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.txt"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="flex flex-col items-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-text-light dark:text-text-dark mb-2">
          Drag and drop your documents here
        </h3>
        <p className="text-xs sm:text-sm text-text-mutedLight dark:text-text-mutedDark mb-6 leading-relaxed">
          Support for <span className="font-semibold text-text-light dark:text-text-dark">PDF, PNG, JPG, and TXT</span> files up to 10 MB each. Processed strictly in volatile memory.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            icon={FileUp}
            loading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>

          {onSelectSample && (
            <Button
              variant="secondary"
              icon={Sparkles}
              onClick={onSelectSample}
              title="Load realistic sample invoice, contract, or resume"
            >
              Try Sample Documents
            </Button>
          )}
        </div>

        {/* Privacy reassurance footnote */}
        <div className="flex items-center gap-2 mt-6 text-[11px] text-teal-700 dark:text-teal-400 font-medium">
          <Shield className="w-3.5 h-3.5" />
          <span>Multer memoryStorage active • Files are never written to disk</span>
        </div>
      </div>
    </div>
  );
};
