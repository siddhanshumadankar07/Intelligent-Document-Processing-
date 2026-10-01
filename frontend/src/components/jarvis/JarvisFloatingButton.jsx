import React from 'react';
import { Bot, Mic, Volume2 } from 'lucide-react';
import { useJarvis } from '../../context/JarvisContext';

export const JarvisFloatingButton = () => {
  const { isOpen, setIsOpen, isListening, isSpeaking, jarvisConfig } = useJarvis();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-cyan-400/40 ${
          isListening
            ? 'ring-4 ring-rose-500 animate-pulse glow-cyan'
            : isSpeaking
            ? 'ring-4 ring-cyan-400 glow-cyan'
            : 'shadow-cyan-500/25 hover:shadow-cyan-500/40'
        }`}
        aria-label={`Open ${jarvisConfig?.name || 'Jarvis'} Assistant`}
      >
        {isListening ? (
          <Mic className="w-6 h-6 animate-bounce text-rose-300" />
        ) : isSpeaking ? (
          <Volume2 className="w-6 h-6 animate-pulse text-cyan-200" />
        ) : (
          <Bot className="w-7 h-7 transition-transform group-hover:rotate-6" />
        )}

        {/* Glowing pulse dot indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-[#090D16]"></span>
        </span>
      </button>
    </div>
  );
};
