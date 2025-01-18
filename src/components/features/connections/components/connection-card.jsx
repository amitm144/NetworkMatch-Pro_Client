// src/components/features/connections/components/connection-card.jsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Building2, MapPin, Users } from 'lucide-react';

export function ConnectionCard({ connection }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {connection.imageUrl ? (
              <img 
                src={connection.imageUrl} 
                alt={connection.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-semibold text-muted-foreground">
                  {connection.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Connection Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{connection.name}</h3>
                {connection.title && (
                  <p className="text-muted-foreground">{connection.title}</p>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(connection.profileUrl, '_blank')}
              >
                View Profile
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {connection.company && (
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {connection.company}
                </span>
              )}
              
              {connection.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {connection.location}
                </span>
              )}
              
              {connection.sharedConnections > 0 && (
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {connection.sharedConnections} shared connections
                </span>
              )}
            </div>

            {connection.connectionDegree && (
              <Badge variant="secondary" className="mt-2">
                {connection.connectionDegree}° connection
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}