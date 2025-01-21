// src/components/features/connections/components/connection-card.jsx

import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";


export function ConnectionCard({ connection }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl font-semibold text-muted-foreground">
                {connection.name?.charAt(0)}
              </span>
            </div>
          </div>

          {/* Connection Info */}
          <div className="flex-1 space-y-2">
              <div className="flex flex-wrap flex-col gap-2">
                <h3 className="text-lg font-semibold">{connection.name}</h3>
                {connection.position && (
                  <p className="text-muted-foreground">{connection.position}</p>
                )}
                {connection.company && (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {connection.company}
                  </span>
                )}
              </div>
          </div>

           {/* Link */}
           <AnimatedButton
                url={connection.profileUrl}
                text="Visit Profile"
                icon="☝🏼"
              >
                View Profile
              </AnimatedButton>
        </div>
      </CardContent>
    </Card>
  );
}
