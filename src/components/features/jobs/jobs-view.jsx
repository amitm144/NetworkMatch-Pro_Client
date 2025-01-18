// src/components/features/jobs/jobs-view.jsx
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/api';
import { useToast } from "@/hooks/use-toast";
import { JobFilters } from './components/job-filters';
import { JobsList } from './components/jobs-list';
import { queryKeys } from '@/lib/query-config';

export function JobsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for jobs with search filters
  const jobsQuery = useQuery({
    queryKey: queryKeys.jobs.search({ searchTerm, location: locationFilter }),
    queryFn: () => jobsApi.searchJobs({
      q: searchTerm,
      location: locationFilter !== 'all' ? locationFilter : undefined,
    }),
    select: (data) => data.data || [],
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Mutation for syncing jobs
  const syncMutation = useMutation({
    mutationFn: jobsApi.syncJobs,
    onSuccess: () => {
      // Invalidate and refetch jobs query
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast({
        title: "Success",
        description: "Jobs have been synced successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message || "Failed to sync jobs.",
      });
    },
  });

  // Debounced search effect using TanStack Query's built-in debouncing
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedLocationFilter = useDebounce(locationFilter, 300);

  // Refetch when debounced filters change
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.jobs.search({
        searchTerm: debouncedSearchTerm,
        location: debouncedLocationFilter,
      }),
    });
  }, [debouncedSearchTerm, debouncedLocationFilter, queryClient]);

  const handleRefresh = () => {
    syncMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <JobFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        onRefresh={handleRefresh}
        isLoading={jobsQuery.isLoading || syncMutation.isPending}
      />

      {jobsQuery.isError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          Error loading jobs: {jobsQuery.error.message}
        </div>
      )}

      <JobsList 
        jobs={jobsQuery.data || []} 
        isLoading={jobsQuery.isLoading || syncMutation.isPending}
      />

      <div className="text-center text-sm text-muted-foreground">
        {jobsQuery.isFetching && !jobsQuery.isLoading && (
          <span>Refreshing results...</span>
        )}
      </div>
    </div>
  );
}

// Custom hook for debouncing values
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}