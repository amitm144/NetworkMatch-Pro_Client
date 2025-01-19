import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from './job-card';

import { Loader2, SearchX } from 'lucide-react';
import { usePagination } from '@/hooks/use-pagination';
import { PaginationControl } from "@/components/ui/common/pagination-control";

export function JobsList({ 
  jobs = [], 
  isLoading,
  itemsPerPage = 10
}) {
  const {
    currentPage,
    totalPages,
    handlePageChange,
    slicePage
  } = usePagination({
    totalItems: jobs.length,
    itemsPerPage
  });

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

  const paginatedJobs = slicePage(jobs);

  return (
    <div className="space-y-8">
      {/* Jobs Grid */}
      <div className="space-y-6">
        {paginatedJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {/* Centered Pagination */}
      <div className="flex justify-center py-8 border-t">
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={jobs.length}
        />
      </div>
    </div>
  );
}