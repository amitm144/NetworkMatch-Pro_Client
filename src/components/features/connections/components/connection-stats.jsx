// src/components/features/connections/components/connection-stats.jsx

import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, MapPin } from 'lucide-react';

export function ConnectionStats({ connections = [] }) {
  const stats = {
    total: connections.length,
    companies: new Set(connections.map(c => c.company).filter(Boolean)).size,
    locations: new Set(connections.map(c => c.location).filter(Boolean)).size
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Connections
              </p>
              <p className="text-2xl font-bold">
                {stats.total.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Companies
              </p>
              <p className="text-2xl font-bold">
                {stats.companies.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <MapPin className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Locations
              </p>
              <p className="text-2xl font-bold">
                {stats.locations.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}