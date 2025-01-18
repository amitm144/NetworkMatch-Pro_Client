// src/components/layout/main-view.jsx
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useData } from "@/lib/data-context";
import { ConnectionsView } from "@/components/features/connections/connections-view";
import { JobsView } from "@/components/features/jobs/jobs-view";
import { MatchingView } from "@/components/features/matching/matching-view";
import { storageApi } from "@/api";

export function MainView() {
  const { fetchJobs, fetchMatches, clearSession } = useData();

  // Use TanStack Query for session state
  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: storageApi.getSessionId,
    retry: false,
    staleTime: Infinity
  });

  useEffect(() => {
    // Initial data fetch
    fetchJobs().catch(console.error);
    if (sessionQuery.data) {
      fetchMatches().catch(console.error);
    }
  }, [sessionQuery.data, fetchJobs, fetchMatches]);

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="h-screen w-full bg-background border-l flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0">
        <h1 className="text-xl font-bold">Connection Matcher</h1>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="matching" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-4 pt-4">
          <TabsTrigger value="matching">Matching</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-hidden">
          <TabsContent value="matching" className="p-4 h-full">
            <MatchingView />
          </TabsContent>
          <TabsContent value="connections" className="p-4 h-full">
            <ConnectionsView />
          </TabsContent>
          <TabsContent value="jobs" className="p-4 h-full">
            <JobsView />
          </TabsContent>
        </div>
      </Tabs>

      {sessionQuery.data && (
        <div className="p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearSession()}
            className="w-full"
          >
            Clear Session
          </Button>
        </div>
      )}
    </div>
  );
}