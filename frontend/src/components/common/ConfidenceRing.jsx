import React from 'react';

export const ConfidenceRing = ({ value = 90, size = 64, strokeWidth = 5, showLabel = true }) => {
  const percentage = Math.min(100, Math.max(0, Math.round(value)));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  let color = '#22C55E'; // Green
  let textClass = 'text-emerald-500 dark:text-emerald-400';
  let badgeLabel = 'High';

  if (percentage < 70) {
    color = '#EF4444'; // Red
    textClass = 'text-rose-500 dark:text-rose-400';
    badgeLabel = 'Low';
  } else if (percentage < 85) {
    color = '#F59E0B'; // Amber
    textClass = 'text-amber-500 dark:text-amber-400';
    badgeLabel = 'Medium';
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-700"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold font-mono ${textClass}`}>
            {percentage}%
          </span>
        </div>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-[10px] text-text-mutedLight dark:text-text-mutedDark uppercase tracking-wider font-semibold">
            Confidence
          </span>
          <span className={`text-xs font-medium ${textClass}`}>
            {badgeLabel}
          </span>
        </div>
      )}
    </div>
  );
};
