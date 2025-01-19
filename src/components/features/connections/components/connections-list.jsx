// src/components/features/connections/components/connections-list.jsx

import { Card, CardContent } from "@/components/ui/card";
import { ConnectionCard } from './connection-card';

import { Loader2, UserX } from 'lucide-react';
import { usePagination } from '@/hooks/use-pagination';
import { PaginationControl } from "@/components/ui/common/pagination-control";

export function ConnectionsList({ 
  connections = [],
  isLoading,
  itemsPerPage = 10
}) {
  const {
    currentPage,
    totalPages,
    handlePageChange,
    slicePage
  } = usePagination({
    totalItems: connections.length,
    itemsPerPage
  });

  if (isLoading) {
    return (
      <Card className="min-h-96">
        <CardContent className="h-full flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-xl text-muted-foreground">Syncing your network...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!Array.isArray(connections) || connections.length === 0) {
    return (
      <Card className="min-h-96">
        <CardContent className="h-full flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <UserX className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-xl text-muted-foreground">No connections found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search filters or sync your LinkedIn network
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const paginatedConnections = slicePage(connections);

  return (
    <div className="space-y-8">
      {/* Connections Grid */}
      <div className="space-y-4">
        {paginatedConnections.map((connection) => (
          <ConnectionCard 
            key={connection.profileUrl?.split('/').pop() || Math.random().toString()}
            connection={connection} 
          />
        ))}
      </div>

      {/* Centered Pagination */}
      <div className="flex justify-center py-8 border-t">
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={connections.length}
        />
      </div>
    </div>
  );
}