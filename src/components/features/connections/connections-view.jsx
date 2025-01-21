import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { linkedinApi } from "@/api";
import { ConnectionsList } from "./components/connections-list";
import { ConnectionFilters } from "./components/connection-filters";
import { ConnectionStats } from "./components/connection-stats";
import { filterConnections, getUniqueCompanies } from "@/lib/connection-utils";
import { queryKeys } from "@/lib/query-config";
import { useSession } from "@/hooks/use-session";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useFilters } from "@/hooks/use-filters";
import { LoadingState } from "@/components/ui/common/loading-state";
import { EmptyState } from "@/components/ui/common/empty-state";
import { FileUpload } from "@/components/ui/file-upload";

export function ConnectionsView() {
  const queryClient = useQueryClient();
  const handleError = useErrorHandler();
  const { session, isLoading: sessionLoading } = useSession();
  const { searchTerm, setSearchTerm, companyFilter, setCompanyFilter } =
    useFilters();

  // Query for connections data
  const connectionsQuery = useQuery({
    queryKey: queryKeys.connections.bySession(session),
    queryFn: () => linkedinApi.getConnections(session),
    enabled: !!session,
    select: (data) => data.connections,
    staleTime: 1000 * 60 * 5,
    retry: false,
    onError: (error) =>
      handleError(error, {
        title: "Connection Error",
        defaultMessage: "Failed to load connections",
        clearSession: error.message?.includes("No connections found"),
      }),
  });

  // Mutation for uploading connections
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return linkedinApi.uploadConnections(formData);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["session"], data.sessionId);
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.all });
    },
    onError: (error) =>
      handleError(error, {
        title: "Upload Failed",
        defaultMessage: "Failed to upload connections",
        clearSession: true,
      }),
  });

  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      uploadMutation.mutate(files[0]);
    }
  };

  // Derived values
  const filteredConnections = connectionsQuery.data
    ? filterConnections(connectionsQuery.data, {
        searchTerm,
        company: companyFilter,
      })
    : [];

  const companies = getUniqueCompanies(connectionsQuery.data || []);

  const Header = (
    <div className="flex flex-col space-y-4 justify-between items-start">
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
          <div className="w-full mx-auto">
            <FileUpload onChange={handleFileUpload} />
          </div>
        {/* <EmptyState
          title="Upload file"
          description="Drag or drop your connection file here or click to upload"
        >
        </EmptyState> */}
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
          Showing {filteredConnections.length} of{" "}
          {connectionsQuery.data?.length || 0} connections
          {searchTerm && ` matching "${searchTerm}"`}
          {companyFilter !== "all" && ` at ${companyFilter}`}
        </p>
      </footer>
    </div>
  );
}
