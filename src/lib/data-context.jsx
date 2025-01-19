// src/lib/data-context.jsx
import { createContext, useContext, useState } from 'react';
import { matchingApi, jobsApi, storageApi } from '@/api';
import { useToast } from "@/hooks/use-toast";

const DataContext = createContext({});

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export function DataProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      // Only fetch if we're not already loading
      if (isLoading) return { data: [] };
      
      setIsLoading(true);
      const response = await jobsApi.searchJobs();
      return response;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Don't show toast for connection errors when there's no session
      if (error.message !== 'Failed to fetch' || sessionId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch jobs"
        });
      }
      return { data: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const currentSessionId = await storageApi.getSessionId();
      
      if (!currentSessionId) {
        setSessionId(null);
        return { matches: [] };
      }

      setSessionId(currentSessionId);
      const response = await matchingApi.getMatches(currentSessionId);
      
      if (response.status === 500 && response.message?.includes('No connections found')) {
        return { matches: [] };
      }
      
      return response;
    } catch (error) {
      if (!error.message?.includes('No connections found')) {
        console.error('Error fetching matches:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch matches"
        });
      }
      return { matches: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = async () => {
    try {
      await storageApi.clearSession();
      setSessionId(null);
      toast({
        title: "Success",
        description: "Session cleared successfully"
      });
    } catch (error) {
      console.error('Error clearing session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear session"
      });
    }
  };

  const value = {
    sessionId,
    isLoading,
    fetchJobs,
    fetchMatches,
    clearSession,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}