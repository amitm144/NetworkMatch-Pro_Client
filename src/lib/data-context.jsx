// src/lib/data-context.jsx
import { createContext, useContext, useState } from 'react';
import { matchingApi, jobsApi, storageApi } from '@/api';
import { useToast } from "@/hooks/use-toast";

const DataContext = createContext({});

export function DataProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobsApi.searchJobs();
      return response;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch jobs"
      });
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
      
      // Handle "no connections" case gracefully
      if (response.status === 500 && response.message?.includes('No connections found')) {
        return { matches: [] };
      }
      
      return response;
    } catch (error) {
      // Only log actual errors, not the "no connections" state
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

export const useData = () => useContext(DataContext);