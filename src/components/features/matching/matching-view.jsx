// src/components/features/matching/matching-view.jsx
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { matchingApi, storageApi } from '@/api';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserX, AlertCircle } from 'lucide-react';
import { MatchCard } from './components/match-card';
import { MatchStats } from './components/match-stats';
import { MatchFilters } from './components/match-filters';
import { queryKeys } from '@/lib/query-config';

export function MatchingView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const { toast } = useToast();

  // Query for session ID
  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: storageApi.getSessionId,
    retry: false,
  });

  // Query for matches using session ID
  const matchesQuery = useQuery({
    queryKey: queryKeys.matches.bySession(sessionQuery.data),
    queryFn: () => matchingApi.getMatches(sessionQuery.data),
    enabled: !!sessionQuery.data,
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
    retry: false, // Don't retry on error
  });

  // Filter matches based on search term and company filter
  const filteredMatches = useMemo(() => {
    const matches = matchesQuery.data || [];
    return matches.filter(match => {
      if (!match?.jobs) return false;

      const matchesSearch = !searchTerm || 
        match.job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.job.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCompany = !companyFilter || 
        companyFilter === 'all' || 
        match.job.company === companyFilter;

      return matchesSearch && matchesCompany;
    });
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

  if (!sessionQuery.data) {
    return (
      <Card>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground">No Active Session</p>
              <p className="text-sm text-muted-foreground">
                Please upload your LinkedIn connections CSV to get started
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (matchesQuery.isLoading) {
    return (
      <Card className="min-h-96">
        <CardContent className="h-full flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-xl text-muted-foreground">Finding matches...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show upload prompt if there's no data
  if (!matchesQuery.data?.length) {
    return (
      <Card>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground">No Matches Available</p>
              <p className="text-sm text-muted-foreground">
                Please upload your LinkedIn connections CSV to see potential matches
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle actual errors (not the "no connections" state)
  if (matchesQuery.isError && !matchesQuery.error.message?.includes('No connections found')) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {matchesQuery.error.message || "Failed to load matches"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
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

      {matchesQuery.data?.length > 0 ? (
        <>
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
        </>
      ) : (
        <Card>
          <CardContent className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <UserX className="h-12 w-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <p className="text-xl text-muted-foreground">No matches found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search filters or uploading more connections
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}