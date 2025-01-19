// hooks/use-session.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { storageApi } from '@/api';

export function useSession() {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: storageApi.getSessionId,
    retry: false,
    staleTime: Infinity
  });

  const clearSession = async () => {
    await storageApi.clearSession();
    queryClient.setQueryData(['session'], null);
  };

  const setSession = (sessionId) => {
    queryClient.setQueryData(['session'], sessionId);
  };

  return {
    session: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    clearSession,
    setSession
  };
}