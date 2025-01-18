import { useState, useEffect } from 'react';
import { storageApi } from '@/api';

export function useSession() {
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const storedSessionId = await storageApi.getSessionId();
        if (storedSessionId) {
          setSessionId(storedSessionId);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const updateSession = async (newSessionId) => {
    try {
      await storageApi.setSessionId(newSessionId);
      setSessionId(newSessionId);
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  };

  const clearSession = async () => {
    try {
      await storageApi.clearSession();
      setSessionId(null);
    } catch (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
  };

  return {
    sessionId,
    isLoading,
    updateSession,
    clearSession,
  };
}