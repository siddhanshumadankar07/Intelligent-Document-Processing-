import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { speechService } from '../services/speechService';
import { useAuth } from './AuthContext';

const JarvisContext = createContext();

export const JarvisProvider = ({ children }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);

  const jarvisConfig = user?.jarvisSettings || {
    name: 'Jarvis',
    tone: 'friendly',
    voice: 'en-US',
    speakingSpeed: 1.0,
    themeColor: '#7C3AED',
    avatar: 'bot-violet',
    autoSpeak: true,  // Jarvis always speaks by default
  };

  // Load chat history on mount / session change
  const fetchChatHistory = useCallback(async () => {
    try {
      const res = await api.get('/chat/history');
      if (res.data?.success && res.data.messages.length > 0) {
        setMessages(res.data.messages);
      } else {
        // Initial greeting
        setMessages([
          {
            id: 'welcome-msg',
            role: 'assistant',
            content: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I'm ${jarvisConfig.name}, your privacy-first intelligence assistant. Ask me anything about your uploaded documents, request cross-file totals, or command me to filter and summarize items.`,
            citations: [],
            createdAt: new Date(),
          }
        ]);
      }
    } catch (_) {}
  }, [user?.name, jarvisConfig.name]);

  useEffect(() => {
    if (user) {
      fetchChatHistory();
    }
  }, [user, fetchChatHistory]);

  // Send message to Jarvis
  const sendMessage = async (text) => {
    if (!text || !text.trim() || isLoading) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await api.post('/chat/message', { message: text.trim() });
      if (res.data?.success) {
        const assistantMsg = res.data.message;
        setMessages((prev) => [...prev, assistantMsg]);

        // If action requires confirmation
        if (assistantMsg.actionExecuted?.status === 'pending_confirmation') {
          setPendingAction(assistantMsg.actionExecuted);
        }

        // Voice output (TTS) — speak every assistant reply unless muted
        if (!isMuted) {
          // Small delay so the UI renders the message first
          setTimeout(() => {
            setIsSpeaking(true);
            // Pick best available voice: prefer natural-sounding voices
            const voices = speechService.getVoices();
            const preferredVoice =
              voices.find((v) => v.name.includes('Google') && v.lang.startsWith('en')) ||
              voices.find((v) => v.name.includes('Microsoft') && v.lang.startsWith('en')) ||
              voices.find((v) => v.lang === 'en-US') ||
              voices[0] ||
              null;
            speechService.speak(assistantMsg.content, {
              rate: jarvisConfig.speakingSpeed || 1.0,
              voiceName: preferredVoice?.name || null,
              lang: preferredVoice?.lang || 'en-US',
              onEnd: () => setIsSpeaking(false),
            });
          }, 100);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue accessing your documents. Please try again.',
          citations: [],
          createdAt: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Input (STT)
  const toggleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechService.startListening({
        onResult: (transcript, isFinal) => {
          if (isFinal && transcript.trim()) {
            setIsListening(false);
            sendMessage(transcript);
          }
        },
        onError: (err) => {
          console.warn('Voice error:', err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
    }
  };

  // Toggle Mute / Stop Speaking
  const toggleMute = () => {
    if (!isMuted) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  // Clear Chat
  const clearChat = async () => {
    try {
      await api.delete('/chat/history');
      setMessages([
        {
          id: 'cleared-msg',
          role: 'assistant',
          content: `Chat history cleared. How can I assist you with your documents?`,
          citations: [],
          createdAt: new Date(),
        }
      ]);
    } catch (_) {}
  };

  return (
    <JarvisContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        isLoading,
        isListening,
        isSpeaking,
        isMuted,
        suggestedPrompts,
        setSuggestedPrompts,
        pendingAction,
        setPendingAction,
        jarvisConfig,
        sendMessage,
        toggleVoiceInput,
        toggleMute,
        clearChat,
        fetchChatHistory,
      }}
    >
      {children}
    </JarvisContext.Provider>
  );
};

export const useJarvis = () => useContext(JarvisContext);
