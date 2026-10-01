import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  X,
  Bot,
  FileText,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useJarvis } from '../../context/JarvisContext';
import { useAuth } from '../../context/AuthContext';
import { JarvisPromptChips } from './JarvisPromptChips';

export const JarvisChatPanel = ({ isFullPage = false }) => {
  const {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    isListening,
    isSpeaking,
    isMuted,
    suggestedPrompts,
    jarvisConfig,
    pendingAction,
    setPendingAction,
    sendMessage,
    toggleVoiceInput,
    toggleMute,
    clearChat,
  } = useJarvis();

  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handlePromptSelect = (prompt) => {
    sendMessage(prompt);
  };

  const defaultPrompts = [
    'What is the total sum across all uploaded documents?',
    'Show all unapproved documents that need review.',
    'Summarize key obligations, dates, and amounts.',
    'List any calculation discrepancies or missing fields.'
  ];

  if (!isOpen && !isFullPage) return null;

  const content = (
    <div className={`flex flex-col h-full bg-[#090D16] ${!isFullPage ? 'border-l border-slate-800' : 'rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl'}`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-4 h-4" />
            {isListening && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">
                {jarvisConfig?.name || 'Jarvis'} Copilot
              </h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-400 font-mono font-medium">
                IDP Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isListening ? '🎙️ Listening to voice...' : isSpeaking ? '🔊 Speaking response...' : 'Zero-retention document intelligence'}
            </p>
          </div>
        </div>

        {/* Controls: Mute, Clear, Close */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isMuted
                ? 'text-slate-400 hover:bg-slate-800'
                : 'text-cyan-400 hover:bg-cyan-500/10'
            }`}
            title={isMuted ? 'Unmute voice output' : 'Mute voice output'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
            title="Clear chat transcript"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {!isFullPage && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id || msg._id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/90 text-slate-200 rounded-bl-none border border-slate-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Source Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">
                      Source Citations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((c, idx) => (
                        <button
                          key={idx}
                          onClick={() => navigate(`/results?doc=${c.documentId || ''}`)}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors border border-cyan-500/20 cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{c.documentName}</span>
                          <span className="text-[10px] opacity-75">(p.{c.page || 1})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs text-slate-400">Jarvis is reasoning over document context...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/40">
        <JarvisPromptChips
          prompts={suggestedPrompts && suggestedPrompts.length > 0 ? suggestedPrompts : defaultPrompts}
          onSelect={handlePromptSelect}
        />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/80 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-cyan-400 hover:border-cyan-500/40'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? 'Listening... Speak now...' : `Ask about documents or totals...`}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );

  if (isFullPage) {
    return <div className="h-full w-full">{content}</div>;
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 shadow-2xl">
      {content}
    </div>
  );
};
