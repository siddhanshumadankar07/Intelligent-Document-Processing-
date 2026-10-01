import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [session, setSession] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  // Sync / initialize session when user logs in
  const initSession = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/sessions/status');
      if (res.data?.success) {
        setSession(res.data.session);
        setRemainingSeconds(res.data.session.remainingSeconds);
        localStorage.setItem('clause_session_id', res.data.session.id);
      }
    } catch (err) {
      // If no active session, start one
      try {
        const startRes = await api.post('/sessions/start');
        if (startRes.data?.success) {
          setSession(startRes.data.session);
          setRemainingSeconds((startRes.data.session.ttlMinutes || 15) * 60);
          localStorage.setItem('clause_session_id', startRes.data.session.id);
        }
      } catch (_) {}
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      initSession();
    } else {
      setSession(null);
      setRemainingSeconds(15 * 60);
    }
  }, [isAuthenticated, initSession]);

  // Live Countdown Timer ticking every second
  useEffect(() => {
    if (!session || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSessionExpired();
          return 0;
        }
        // Trigger 2-minute warning modal
        if (prev === 120) {
          setShowWarningModal(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const handleSessionExpired = async () => {
    // When expired, redirect to session end / wipe notification
    setSession(null);
    localStorage.removeItem('clause_session_id');
  };

  const extendSession = async (minutes = 15) => {
    try {
      const res = await api.post('/sessions/extend', { minutes });
      if (res.data?.success) {
        const expiresAt = new Date(res.data.session.expiresAt).getTime();
        const newSec = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        setRemainingSeconds(newSec);
        setShowWarningModal(false);
        return true;
      }
    } catch (err) {
      console.error('Failed extending session:', err);
      return false;
    }
  };

  const startNewSession = async () => {
    try {
      const res = await api.post('/sessions/start');
      if (res.data?.success) {
        setSession(res.data.session);
        setRemainingSeconds((res.data.session.ttlMinutes || 15) * 60);
        localStorage.setItem('clause_session_id', res.data.session.id);
        return res.data.session;
      }
    } catch (err) {
      console.error('Failed starting new session:', err);
    }
  };

  // Format seconds into MM:SS
  const formatCountdown = () => {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Status color: green > 2m, amber 30s - 2m, red < 30s
  const getTimerUrgency = () => {
    if (remainingSeconds <= 30) return 'critical';
    if (remainingSeconds <= 120) return 'warning';
    return 'normal';
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        remainingSeconds,
        formattedTime: formatCountdown(),
        urgency: getTimerUrgency(),
        showWarningModal,
        setShowWarningModal,
        isEndingSession,
        setIsEndingSession,
        extendSession,
        startNewSession,
        initSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
