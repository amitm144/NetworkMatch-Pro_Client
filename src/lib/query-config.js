// src/lib/query-config.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Query keys for caching and invalidation
export const queryKeys = {
  connections: {
    all: ['connections'],
    bySession: (sessionId) => ['connections', sessionId],
  },
  jobs: {
    all: ['jobs'],
    search: (filters) => ['jobs', 'search', filters],
  },
  matches: {
    all: ['matches'],
    bySession: (sessionId) => ['matches', sessionId],
  },
};