import React from 'react';
import { ShieldCheck, Clock, Plus, AlertCircle } from 'lucide-react';
import { useSession } from '../../context/SessionContext';

export const PrivacyBadge = ({ onExtend }) => {
  const { formattedTime, urgency, extendSession } = useSession();

  const handleExtendClick = (e) => {
    e.stopPropagation();
    if (onExtend) onExtend();
    else extendSession(15);
  };

  const urgencyStyles = {
    normal: {
      border: 'border-teal-500/30 dark:border-teal-500/40 bg-teal-500/10 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300',
      timer: 'text-teal-600 dark:text-teal-400',
      dot: 'bg-teal-500 animate-pulse',
      badge: 'bg-teal-500/20 text-teal-600 dark:text-teal-300',
    },
    warning: {
      border: 'border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
      timer: 'text-amber-600 dark:text-amber-400 font-bold',
      dot: 'bg-amber-500 animate-ping',
      badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
    },
    critical: {
      border: 'border-rose-500/50 bg-rose-500/15 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300',
      timer: 'text-rose-600 dark:text-rose-400 font-extrabold animate-pulse',
      dot: 'bg-rose-500 animate-ping',
      badge: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',
    },
  };

  const style = urgencyStyles[urgency] || urgencyStyles.normal;

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border text-xs transition-all duration-300 shadow-sm ${style.border}`}
      title="Zero-retention privacy active: all files and chats are purged upon session expiry"
    >
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span className="font-semibold hidden sm:inline">Zero-Retention</span>
      </div>

      <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700" />

      <div className="flex items-center gap-1">
        <Clock className="w-3.5 h-3.5 text-text-mutedLight dark:text-text-mutedDark shrink-0" />
        <span className="text-text-mutedLight dark:text-text-mutedDark hidden md:inline">Purge in:</span>
        <span className={`font-mono text-xs font-semibold ${style.timer}`}>
          {formattedTime}
        </span>
      </div>

      <button
        onClick={handleExtendClick}
        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-primary font-semibold transition-colors cursor-pointer"
        title="Extend session by +15 minutes"
      >
        <Plus className="w-3 h-3" />
        <span className="text-[11px]">Extend</span>
      </button>
    </div>
  );
};
