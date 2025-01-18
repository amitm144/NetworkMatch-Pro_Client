// src/components/features/matching/components/match-stats.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  Building2, 
  Users, 
  Star,
  TrendingUp,
  Network
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export function MatchStats({ matches = [] }) {
  // Calculate total opportunities and unique companies
  const totalOpportunities = matches.length;
  const companies = new Set(matches.map(match => match?.job?.company).filter(Boolean));
  const totalCompanies = companies.size;

  // Calculate connection metrics
  const totalConnections = matches.reduce((sum, match) => 
    sum + (match?.connections?.length || 0), 0
  );

  // Calculate connection strength distribution
  const connectionStrength = matches.reduce((acc, match) => {
    const connectionCount = match?.connections?.length || 0;
    if (connectionCount > 3) acc.strong++;
    else if (connectionCount >= 2) acc.medium++;
    else if (connectionCount === 1) acc.weak++;
    return acc;
  }, { strong: 0, medium: 0, weak: 0 });

  // Calculate percentages for the progress bars
  const totalMatches = matches.length;
  const strongPercent = totalMatches ? (connectionStrength.strong / totalMatches) * 100 : 0;
  const mediumPercent = totalMatches ? (connectionStrength.medium / totalMatches) * 100 : 0;
  const weakPercent = totalMatches ? (connectionStrength.weak / totalMatches) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Briefcase className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Job Opportunities
                </p>
                <p className="text-2xl font-bold">
                  {totalOpportunities.toLocaleString()}
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
                  {totalCompanies.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Connections
                </p>
                <p className="text-2xl font-bold">
                  {totalConnections.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Strength Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Connection Strength Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Strong Network</span>
                <span className="text-sm text-muted-foreground">
                  (3 connections)
                </span>
              </div>
              <span className="text-sm font-medium">
                {connectionStrength.strong} opportunities
              </span>
            </div>
            <Progress value={strongPercent} className="bg-primary/20" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Growing Network</span>
                <span className="text-sm text-muted-foreground">
                  (2-3 connections)
                </span>
              </div>
              <span className="text-sm font-medium">
                {connectionStrength.medium} opportunities
              </span>
            </div>
            <Progress value={mediumPercent} className="bg-primary/20" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Emerging Network</span>
                <span className="text-sm text-muted-foreground">
                  (1 connection)
                </span>
              </div>
              <span className="text-sm font-medium">
                {connectionStrength.weak} opportunities
              </span>
            </div>
            <Progress value={weakPercent} className="bg-primary/20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}