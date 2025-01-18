import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from './job-card';
import { Loader2, SearchX } from 'lucide-react';

export function JobsList({ jobs, isLoading }) {
  if (isLoading) {
    return (
      <Card className="min-h-96">
        <CardContent className="h-full flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-xl text-muted-foreground">Discovering opportunities...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!jobs.length) {
    return (
      <Card className="min-h-96">
        <CardContent className="h-full flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <SearchX className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-xl text-muted-foreground">No jobs found matching your criteria.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search filters.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}