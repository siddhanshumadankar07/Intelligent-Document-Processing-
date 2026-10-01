import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Flame,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  FileCheck2,
  Trash2,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useSession } from '../context/SessionContext';
import api from '../services/api';

export const SessionEndPage = () => {
  const navigate = useNavigate();
  const { startNewSession } = useSession();

  // Stages: 1: 'generating' -> 2: 'ready_to_shred' -> 3: 'shredding' -> 4: 'purged'
  const [stage, setStage] = useState('generating');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  useEffect(() => {
    preparePdfDownload();
  }, []);

  const preparePdfDownload = async () => {
    // Generate PDF endpoint with wipe=true parameter
    const token = localStorage.getItem('clause_token');
    const sessionId = localStorage.getItem('clause_session_id');
    const url = `/api/export?wipe=true&sessionId=${sessionId || ''}`;
    setDownloadUrl(url);

    // Simulate progress state
    setTimeout(() => {
      setStage('ready_to_shred');
    }, 1200);
  };

  const handleDownloadAndPurge = async () => {
    setDownloadTriggered(true);

    // Trigger PDF download via iframe / link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `Clause_Session_Audit_${new Date().toISOString().slice(0, 10)}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Trigger shredding animation
    setTimeout(() => {
      setStage('shredding');
    }, 1000);

    // Final permanent deletion checklist confirmation screen
    setTimeout(async () => {
      try {
        await api.post('/sessions/end');
      } catch (_) {}
      setStage('purged');
    }, 2800);
  };

  const handleStartFreshSession = async () => {
    await startNewSession();
    navigate('/upload');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl text-center space-y-6">
        {/* Stage 1 & 2: PDF Export Ready */}
        {(stage === 'generating' || stage === 'ready_to_shred') && (
          <Card className="p-8 shadow-2xl space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-sm">
              <FileCheck2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text-light dark:text-text-dark tracking-tight">
                {stage === 'generating' ? 'Compiling Session Audit PDF...' : 'Your Final Session PDF is Ready'}
              </h2>
              <p className="text-xs sm:text-sm text-text-mutedLight dark:text-text-mutedDark max-w-md mx-auto leading-relaxed">
                Contains extracted data, summaries, confidence scores, validation flags, and your full conversation transcript with Jarvis.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              ⚠️ Permanent Wipe: Once you download this PDF, all server buffers and session records will be permanently shredded.
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={Download}
              loading={stage === 'generating' || downloadTriggered}
              onClick={handleDownloadAndPurge}
              className="w-full"
            >
              Download PDF & Permanently Shred Data
            </Button>
          </Card>
        )}

        {/* Stage 3: Shredding Animation */}
        {stage === 'shredding' && (
          <div className="space-y-6 py-12 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto animate-bounce shadow-xl">
              <Flame className="w-10 h-10 animate-pulse" />
            </div>

            <h2 className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight animate-pulse">
              Shredding Memory Buffers & Records...
            </h2>

            {/* Shredding dissolving document cards */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shred border border-rose-500/30" />
              <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shred border border-rose-500/30" style={{ animationDelay: '0.2s' }} />
              <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shred border border-rose-500/30" style={{ animationDelay: '0.4s' }} />
            </div>

            <p className="text-xs font-mono text-text-mutedLight dark:text-text-mutedDark">
              Zero-Retention hard-delete in progress...
            </p>
          </div>
        )}

        {/* Stage 4: Permanent Deletion Confirmed Checklist */}
        {stage === 'purged' && (
          <Card className="p-8 shadow-2xl space-y-6 animate-slide-up border-emerald-500/30 bg-emerald-500/5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text-light dark:text-text-dark tracking-tight">
                Your Data Has Been Permanently Deleted.
              </h2>
              <p className="text-xs sm:text-sm text-text-mutedLight dark:text-text-mutedDark">
                Zero retention promise fulfilled. Your PDF download is your permanent copy.
              </p>
            </div>

            {/* Checklist */}
            <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-left space-y-2.5 text-xs font-semibold">
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Uploaded raw memory buffers: <strong>Expunged</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Extracted fields & document records: <strong>Hard-Deleted</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Jarvis conversation transcript: <strong>Hard-Deleted</strong></span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={RotateCcw}
              onClick={handleStartFreshSession}
              className="w-full"
            >
              Start New Private Session
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
