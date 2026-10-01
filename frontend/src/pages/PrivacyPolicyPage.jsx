import React from 'react';
import { ShieldCheck, Lock, Trash2, Server, EyeOff, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../components/common/Card';

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-text-light dark:text-text-dark tracking-tight">
          Clause Privacy & Zero-Retention Policy
        </h1>
        <p className="text-xs sm:text-sm text-text-mutedLight dark:text-text-mutedDark">
          Last Updated: March 2026 • Plain-Language Guarantee
        </p>
      </div>

      {/* Two-Column Comparison Summary Card */}
      <Card className="p-6 sm:p-8 shadow-xl">
        <h2 className="text-lg font-bold text-text-light dark:text-text-dark mb-6 text-center">
          At a Glance: What We Process vs. What We Never Keep
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Temporary Session Processing */}
          <div className="p-5 rounded-2xl bg-teal-500/5 dark:bg-teal-950/20 border border-teal-500/20 space-y-3">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>What is Processed During Session</span>
            </div>
            <ul className="space-y-2 text-xs text-text-mutedLight dark:text-text-mutedDark leading-relaxed">
              <li>• In-memory RAM buffer for OCR & text parsing</li>
              <li>• Structured field schema matching and validation</li>
              <li>• Encrypted token-by-token transmission to Anthropic Claude SDK</li>
              <li>• Transient session-scoped chat context for Jarvis</li>
              <li>• Final comprehensive PDF export delivered to user</li>
            </ul>
          </div>

          {/* Column 2: What We Never Keep */}
          <div className="p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <XCircle className="w-5 h-5" />
              <span>What We NEVER Store or Retain</span>
            </div>
            <ul className="space-y-2 text-xs text-text-mutedLight dark:text-text-mutedDark leading-relaxed">
              <li>• Zero files written to server disk or cloud storage buckets</li>
              <li>• Zero model training on your confidential files</li>
              <li>• Zero document logs, analytics, or error snippets containing content</li>
              <li>• Zero chat transcripts retained after session termination</li>
              <li>• Zero OAuth access tokens saved to database</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Plain Language Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-text-mutedLight dark:text-text-mutedDark leading-relaxed">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-text-light dark:text-text-dark">
            1. The Zero-Retention Architecture
          </h3>
          <p>
            Clause operates on a strict zero-retention paradigm inspired by transient printing services. When you upload files, they are handled in volatile system RAM (via Multer memoryStorage). The binary memory buffers are expunged immediately after character extraction.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-text-light dark:text-text-dark">
            2. Session Expiry & Automated Hard-Deletion
          </h3>
          <p>
            Every user session is governed by an automated time-to-live (TTL) index in MongoDB and a background scheduler running every two minutes. If you close your browser or allow the session timer to lapse, all records linked to your session are hard-deleted automatically.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-text-light dark:text-text-dark">
            3. AI Processing & Prompt Injection Security
          </h3>
          <p>
            When documents are structured or queried through Jarvis, text is transmitted strictly via authenticated enterprise APIs. Document text is enclosed within strict data boundary tags and treated exclusively as untrusted data to defend against prompt-injection vulnerabilities.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-text-light dark:text-text-dark">
            4. Account Data & Permanent Purge
          </h3>
          <p>
            After a session concludes, we retain only your account profile (name, email, password hash, profession, and Jarvis tone settings). You can permanently delete your entire account and all associated records at any time from the Settings tab.
          </p>
        </div>
      </div>
    </div>
  );
};
