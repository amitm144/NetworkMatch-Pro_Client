// src/components/features/connections/connections-view.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { linkedinApi, storageApi } from '@/api';
import { useToast } from "@/hooks/use-toast";
import { ConnectionsList } from './components/connections-list';
import { ConnectionFilters } from './components/connection-filters';
import { ConnectionStats } from './components/connection-stats';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, AlertCircle } from 'lucide-react';
import { filterConnections, getUniqueCompanies } from '@/lib/connection-utils';
import { queryKeys } from '@/lib/query-config';

export function ConnectionsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for session ID
  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: storageApi.getSessionId,
    retry: false,
    staleTime: Infinity // Session ID doesn't change often
  });

  // Query for connections data - only runs when we have a session
  const connectionsQuery = useQuery({
    queryKey: queryKeys.connections.bySession(sessionQuery.data),
    queryFn: async () => {
      try {
        const response = await linkedinApi.getConnections(sessionQuery.data);
        return response;
      } catch (error) {
        // If no connections found, clear session
        if (error.message?.includes('No connections found')) {
          await storageApi.clearSession();
          queryClient.setQueryData(['session'], null);
        }
        throw error;
      }
    },
    enabled: !!sessionQuery.data, // Only fetch if we have a session ID
    select: (data) => data.connections,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: false // Don't retry on error
  });

  // Mutation for uploading connections
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const { sessionId } = await linkedinApi.uploadConnections(formData);
      await storageApi.setSessionId(sessionId);
      return sessionId;
    },
    onSuccess: (sessionId) => {
      queryClient.setQueryData(['session'], sessionId);
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.all });
      toast({
        title: "Success",
        description: "LinkedIn connections synced successfully.",
      });
    },
    onError: async (error) => {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message || "Failed to sync LinkedIn connections.",
      });
      await storageApi.clearSession();
      queryClient.setQueryData(['session'], null);
    },
  });

  // Filter connections using the utility function
  const filteredConnections = filterConnections(connectionsQuery.data || [], {
    searchTerm,
    company: companyFilter
  });

  // Get unique companies for the filter dropdown
  const companies = getUniqueCompanies(connectionsQuery.data || []);

  const handleFileUpload = (file) => {
    uploadMutation.mutate(file);
  };

  // Show upload prompt if no connections
  if (!sessionQuery.data) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">LinkedIn Network</h1>
            <p className="text-muted-foreground text-lg">
              Manage and analyze your professional connections
            </p>
          </div>
          
          <Button
            size="lg"
            onClick={() => document.getElementById('file-upload').click()}
            disabled={uploadMutation.isPending}
            className="flex items-center gap-2"
          >
            <Upload className="h-5 w-5" />
            {uploadMutation.isPending ? "Syncing..." : "Upload LinkedIn CSV"}
          </Button>
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
        </div>

        <Card>
          <CardContent className="h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <p className="text-xl text-muted-foreground">No Connections Found</p>
                <p className="text-sm text-muted-foreground">
                  Upload your LinkedIn connections CSV to get started
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">LinkedIn Network</h1>
          <p className="text-muted-foreground text-lg">
            Manage and analyze your professional connections
          </p>
        </div>
        
        <Button
          size="lg"
          onClick={() => document.getElementById('file-upload').click()}
          disabled={uploadMutation.isPending}
          className="flex items-center gap-2"
        >
          <Upload className="h-5 w-5" />
          {uploadMutation.isPending ? "Syncing..." : "Upload LinkedIn CSV"}
        </Button>
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
      </div>

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