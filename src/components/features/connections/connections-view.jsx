import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { linkedinApi } from '@/api';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { ConnectionsList } from './components/connections-list';
import { ConnectionFilters } from './components/connection-filters';
import { ConnectionStats } from './components/connection-stats';
import { filterConnections, getUniqueCompanies } from '@/lib/connection-utils';
import { queryKeys } from '@/lib/query-config';
import { useSession } from '@/hooks/use-session';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useFilters } from '@/hooks/use-filters';
import { LoadingState } from '@/components/ui/common/loading-state';
import { EmptyState } from '@/components/ui/common/empty-state';

export function ConnectionsView() {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();
  const { session, isLoading: sessionLoading } = useSession();
  const {
    searchTerm,
    setSearchTerm,
    companyFilter,
    setCompanyFilter
  } = useFilters();

  // Query for connections data
  const connectionsQuery = useQuery({
    queryKey: queryKeys.connections.bySession(session),
    queryFn: () => linkedinApi.getConnections(session),
    enabled: !!session,
    select: (data) => data.connections,
    staleTime: 1000 * 60 * 5,
    retry: false,
    onError: (error) => handleError(error, {
      title: "Connection Error",
      defaultMessage: "Failed to load connections",
      clearSession: error.message?.includes('No connections found')
    })
  });

  // Mutation for uploading connections
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return linkedinApi.uploadConnections(formData);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['session'], data.sessionId);
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.all });
    },
    onError: (error) => handleError(error, {
      title: "Upload Failed",
      defaultMessage: "Failed to upload connections",
      clearSession: true
    })
  });

  const handleFileUpload = (file) => {
    uploadMutation.mutate(file);
  };

  // Derived values
  const filteredConnections = connectionsQuery.data 
    ? filterConnections(connectionsQuery.data, {
        searchTerm,
        company: companyFilter
      }) 
    : [];

  const companies = getUniqueCompanies(connectionsQuery.data || []);

  // UI Components
  const UploadButton = (
    <Button
      size="lg"
      onClick={() => document.getElementById('file-upload').click()}
      disabled={uploadMutation.isPending}
      className="flex items-center gap-2 w-full bg-blue-600"
    >
      <Upload className="h-5 w-5" />
      {uploadMutation.isPending ? "Syncing..." : "Upload LinkedIn CSV"}
    </Button>
  );

  const Header = (
    <div className="flex flex-col space-y-4 justify-between items-start">

      {UploadButton}
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
            e.target.value = '';
          }
        }}
      />
        <h1 className="text-3xl font-bold tracking-tight">LinkedIn Network</h1>
        <p className="text-muted-foreground text-lg">
          Manage and analyze your professional connections
        </p>
    </div>
  );

  // Loading and error states
  if (sessionLoading || connectionsQuery.isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {Header}
        <LoadingState message="Loading connections..." />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {Header}
        <EmptyState
          title="No Connections CSV Found"
          description="Upload your LinkedIn connections CSV to get started"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {Header}

      <ConnectionStats connections={connectionsQuery.data || []} />

      <div className="grid gap-6">
        <ConnectionFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          companyFilter={companyFilter}
          onCompanyChange={setCompanyFilter}
          companies={companies}
        />

        <ConnectionsList 
          connections={filteredConnections} 
          isLoading={connectionsQuery.isLoading || uploadMutation.isPending} 
        />
      </div>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Showing {filteredConnections.length} of {connectionsQuery.data?.length || 0} connections
          {searchTerm && ` matching "${searchTerm}"`}
          {companyFilter !== 'all' && ` at ${companyFilter}`}
        </p>
      </footer>
    </div>
  );
}
