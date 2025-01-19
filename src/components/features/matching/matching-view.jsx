// components/features/matching/matching-view.jsx
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { matchingApi } from '@/api';
import { MatchCard } from './components/match-card';
import { MatchStats } from './components/match-stats';
import { MatchFilters } from './components/match-filters';
import { queryKeys } from '@/lib/query-config';
import { useSession } from '@/hooks/use-session';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useFilters } from '@/hooks/use-filters';
import { LoadingState } from '@/components/ui/common/loading-state';
import { EmptyState } from '@/components/ui/common/empty-state';
import { Upload } from 'lucide-react';

export function MatchingView() {
  const handleError = useErrorHandler();
  const { session, isLoading: sessionLoading } = useSession();
  const { searchTerm, setSearchTerm, companyFilter, setCompanyFilter } = useFilters();

  // Query for matches using session ID
  const matchesQuery = useQuery({
    queryKey: queryKeys.matches.bySession(session),
    queryFn: () => matchingApi.getMatches(session),
    enabled: !!session,
    select: (response) => {
      if (response?.matches && Array.isArray(response.matches)) {
        return response.matches.filter(match => 
          match?.jobs && 
          match?.connections && 
          Array.isArray(match.connections)
        );
      }
      return [];
    },
    retry: false,
    onError: (error) => handleError(error, {
      title: "Matching Error",
      defaultMessage: "Failed to load matches",
      clearSession: error.message?.includes('No connections found')
    })
  });

  // Filter matches based on search term and company filter




  //FIRST TRY , WORKS BUT NOT THE BEST
  // const filteredMatches = useMemo(() => {
  //   const matches = matchesQuery.data || [];
  
  //   return matches
  //     .map(match => {
  //       if (!match?.jobs?.length && !match?.connections?.length) return null;
  
  //       // Filter jobs based on the search term
  //       const filteredJobs = match.jobs.filter(job =>
  //         !searchTerm || job.title?.toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  
  //       // Determine if the match should be included based on jobs and company filter
  //       const matchesCompany = !companyFilter ||
  //         companyFilter === 'all' ||
  //         match.company?.toLowerCase() === companyFilter.toLowerCase();
  
  //       // Only include matches with relevant jobs or matching company
  //       if ((filteredJobs.length > 0 || matchesCompany) && matchesCompany) {
  //         return {
  //           ...match,
  //           jobs: filteredJobs, // Only filtered jobs
  //           connections: match.connections, // Include all connections
  //         };
  //       }
  
  //       return null;
  //     })
  //     .filter(Boolean); // Remove null entries
  // }, [matchesQuery.data, searchTerm, companyFilter]);
  

  //SECOND TRY , WORKS PERFECTLY BUT WITHOUT EMPTY STATE
  // const filteredMatches = useMemo(() => {
  //   const matches = matchesQuery.data || [];
  
  //   return matches
  //     .map(match => {
  //       if (!match?.jobs?.length && !match?.connections?.length) return null;
  
  //       // Filter jobs by search term
  //       const filteredJobs = match.jobs.filter(job =>
  //         searchTerm && job.title?.toLowerCase().includes(searchTerm.toLowerCase())
  //       );
  
  //       // Filter connections by search term
  //       const filteredConnections = match.connections.filter(connection =>
  //         searchTerm &&
  //         (connection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //          connection.position?.toLowerCase().includes(searchTerm.toLowerCase()))
  //       );
  
  //       // Define inclusion rules based on the search context
  //       const isJobSearch = filteredJobs.length > 0; // Matches job titles
  //       const isConnectionSearch = filteredConnections.length > 0; // Matches connection names/positions
  
  //       // Handle cases based on what is matched
  //       if (isJobSearch || isConnectionSearch) {
  //         return {
  //           ...match,
  //           jobs: isConnectionSearch ? match.jobs : filteredJobs, // Show all jobs for connection search, or filtered jobs for job search
  //           connections: isJobSearch ? match.connections : filteredConnections, // Show all connections for job search, or filtered connections for connection search
  //         };
  //       }
  
  //       return null; // Exclude companies with no matches
  //     })
  //     .filter(Boolean); // Remove null entries
  // }, [matchesQuery.data, searchTerm, companyFilter]);

  //THIRD TRY , WORKS PERFECTLY WITH EMPTY STATE
  const filteredMatches = useMemo(() => {
    const matches = matchesQuery.data || [];
  
    return matches
      .map(match => {
        if (!match?.jobs?.length && !match?.connections?.length) return null;
  
        // If the search term is empty, return all jobs and connections
        if (!searchTerm) {
          // Still respect company filter
          const matchesCompany = !companyFilter ||
            companyFilter === 'all' ||
            match.company?.toLowerCase() === companyFilter.toLowerCase();
  
          return matchesCompany ? match : null;
        }
  
        // Filter jobs by search term
        const filteredJobs = match.jobs.filter(job =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
  
        // Filter connections by search term
        const filteredConnections = match.connections.filter(connection =>
          connection.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          connection.position?.toLowerCase().includes(searchTerm.toLowerCase())
        );
  
        // Define inclusion rules based on the search term context
        const isJobSearch = filteredJobs.length > 0; // Matches job titles
        const isConnectionSearch = filteredConnections.length > 0; // Matches connection names/positions
  
        // Handle cases based on what is matched
        if (isJobSearch || isConnectionSearch) {
          return {
            ...match,
            jobs: isConnectionSearch ? match.jobs : filteredJobs, // Show all jobs for connection search, or filtered jobs for job search
            connections: isJobSearch ? match.connections : filteredConnections, // Show all connections for job search, or filtered connections for connection search
          };
        }
  
        return null; // Exclude companies with no matches
      })
      .filter(Boolean); // Remove null entries
  }, [matchesQuery.data, searchTerm, companyFilter]);
  
  
  // Get unique companies from matches
  const companies = useMemo(() => {
    const matches = matchesQuery.data || [];
    return [...new Set(
      matches
        .map(match => match?.job?.company)
        .filter(Boolean)
    )];
  }, [matchesQuery.data]);

  if (sessionLoading || matchesQuery.isLoading) {
    return <LoadingState message="Finding matches..." />;
  }

  if (!session) {
    return (
      <EmptyState
        title="No Active Session"
        description="Please upload your LinkedIn connections CSV to get started"
        icon={Upload}
      />
    );
  }

  if (!matchesQuery.data?.length) {
    return (
      <EmptyState
        title="No Matches Available"
        description="Upload your LinkedIn connections CSV to see potential matches"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Job Matches</h1>
        <p className="text-muted-foreground text-lg">
          Discover job opportunities through your network
        </p>
      </div>

      <MatchStats matches={matchesQuery.data} />
      
      <div className="grid gap-6">
        <MatchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          companyFilter={companyFilter}
          onCompanyChange={setCompanyFilter}
          companies={companies}
        />

        <div className="space-y-6">
          {filteredMatches.map((match) => (
            <MatchCard 
              key={match.jobs.id || Math.random()} 
              match={match} 
            />
          ))}
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Showing {filteredMatches.length} of {matchesQuery.data.length} matches
          {searchTerm && ` matching "${searchTerm}"`}
          {companyFilter !== 'all' && ` at ${companyFilter}`}
        </p>
      </footer>
    </div>
  );
}
