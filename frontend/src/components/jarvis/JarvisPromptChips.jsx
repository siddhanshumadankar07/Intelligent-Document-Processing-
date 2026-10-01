import React from 'react';
import { Sparkles } from 'lucide-react';

export const JarvisPromptChips = ({ prompts = [], onSelectPrompt }) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-1 no-scrollbar">
      <Sparkles className="w-3.5 h-3.5 text-jarvis shrink-0 ml-1" />
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(prompt)}
          className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-jarvis/10 dark:bg-jarvis/20 text-jarvis hover:bg-jarvis/25 transition-colors border border-jarvis/20 cursor-pointer shrink-0"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
