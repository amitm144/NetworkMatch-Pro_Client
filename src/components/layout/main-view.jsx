// src/components/layout/main-view.jsx
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useData } from "@/lib/data-context";
import { ConnectionsView } from "@/components/features/connections/connections-view";
import { JobsView } from "@/components/features/jobs/jobs-view";
import { MatchingView } from "@/components/features/matching/matching-view";
import { useSession } from "@/hooks/use-session";
import { AnimatedTabs } from "../ui/tabs-animated";
import GuideView from "../features/guide/guide-view";

export function MainView() {
  const { fetchJobs, fetchMatches } = useData();
  const { session, clearSession, isLoading } = useSession();

  useEffect(() => {
    if (session) {
      fetchJobs().catch(console.error);
      fetchMatches().catch(console.error);
    }
  }, [session, fetchJobs, fetchMatches]);

  const handleClose = () => {
    window.close();
  };

  const tabs = [
   
    {
      title: "Matching",
      value: "matching",
      content: (
        <div className="w-full max-w-4xl mx-auto h-full overflow-y-auto rounded-2xl p-8 bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-800">
          <MatchingView />
        </div>
      ),
    },
    {
      title: "Connections",
      value: "connections",
      content: (
        <div className="w-full max-w-4xl mx-auto h-full overflow-auto rounded-2xl p-8 bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-800">
          <ConnectionsView />
        </div>
      ),
    },
    {
      title: "Jobs",
      value: "jobs",
      content: (
        <div className="w-full max-w-4xl mx-auto h-full overflow-auto rounded-2xl p-8 bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-800">
          <JobsView />
        </div>
      ),
    },
    {
      title: "Guide",  
      value: "guide",
      content: (
        <div className="w-full max-w-4xl mx-auto h-full overflow-y-auto rounded-2xl p-8 bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-800">
          <GuideView />
        </div>
      ),
    },
  ];

  return (
    <div className="h-screen w-full bg-gray-100 dark:bg-black border-l flex flex-col">
      <div className="flex items-center justify-between p-6 border-b bg-white dark:bg-zinc-900 sticky top-0 shadow-md z-50">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        NetworkMatch Pro
        </h1>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-6 flex-shrink-0 h-[calc(100vh-9rem)] ">
          <AnimatedTabs
            tabs={tabs}
            containerClassName="justify-center"
            activeTabClassName=""
            tabClassName="text-base px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all rounded-lg"
          />
        </div>

        <div className="flex-1 overflow-hidden px-6 pb-6">
          <div className="h-full">{/* Tab content will render here */}</div>
        </div>
      </div>
    </div>
  );
}