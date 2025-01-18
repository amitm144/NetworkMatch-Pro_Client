// src/components/features/connections/components/connections-list.jsx

import { Card, CardContent } from "@/components/ui/card";
import { ConnectionCard } from './connection-card';
import { Loader2, UserX } from 'lucide-react';

export function ConnectionsList({ connections, isLoading }) {

console.log(connections);

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

  if (!connections.length) {
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

  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <ConnectionCard 
          key={connection.profileUrl.split('/').pop()} 
          connection={connection} 
        />
      ))}
    </div>
  );
}