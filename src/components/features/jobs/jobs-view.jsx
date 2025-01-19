// components/features/jobs/jobs-view.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/api';
import { JobFilters } from './components/job-filters';
import { JobsList } from './components/jobs-list';
import { useFilters } from '@/hooks/use-filters';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { LoadingState } from '@/components/ui/common/loading-state';
import { EmptyState } from '@/components/ui/common/empty-state';

// Utility function to filter jobs
const filterJobs = (jobs, { searchTerm, location }) => {
  return jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLocation = location === 'all' || 
      job.location?.toLowerCase() === location.toLowerCase();

    return matchesSearch && matchesLocation;
  });
};

export function JobsView() {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();
  const { 
    searchTerm, 
    setSearchTerm,
    locationFilter, 
    setLocationFilter
  } = useFilters();

  // Query for all jobs without filters
  const jobsQuery = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsApi.searchJobs(),
    select: (data) => data.jobs || [],
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Mutation for syncing jobs
  const syncMutation = useMutation({
    mutationFn: jobsApi.syncJobs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => handleError(error, {
      title: "Sync Failed",
      defaultMessage: "Failed to sync jobs"
    })
  });

  // Apply client-side filtering
  const filteredJobs = jobsQuery.data 
    ? filterJobs(jobsQuery.data, {
        searchTerm,
        location: locationFilter
      })
    : [];

  // Get unique locations for the filter dropdown
  const locations = jobsQuery.data
    ? [...new Set(jobsQuery.data.map(job => job.location).filter(Boolean))]
    : [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Available Jobs</h1>
        <p className="text-muted-foreground text-lg">
          Browse and filter available positions
        </p>
      </div>

      <div className="space-y-6">
        <JobFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          locations={locations}
          onRefresh={() => syncMutation.mutate()}
          isLoading={jobsQuery.isLoading || syncMutation.isPending}
        />

        {jobsQuery.isLoading ? (
          <LoadingState message="Loading jobs..." />
        ) : jobsQuery.isError ? (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            Error loading jobs: {jobsQuery.error.message}
          </div>
        ) : !filteredJobs.length ? (
          <EmptyState
            title="No Jobs Found"
            description="No jobs match your current filters"
          />
        ) : (
          <>
            <JobsList
              jobs={filteredJobs}
              isLoading={false}
            />

            <footer className="text-center text-sm text-muted-foreground">
              <p>
                Showing {filteredJobs.length} of {jobsQuery.data.length} jobs
                {searchTerm && ` matching "${searchTerm}"`}
                {locationFilter !== 'all' && ` in ${locationFilter}`}
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}