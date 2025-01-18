// src/components/features/matching/components/match-card.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Building2,
  Users,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

export function MatchCard({ match }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!match) return null;
  const { company, jobs = [], connections = [], logo } = match;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Company Information */}
          <div className="flex items-start gap-4">
            {logo ? (
              <img 
                src={logo} 
                alt={`${company} logo`}
                className="w-16 h-16 object-contain rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">{company}</h3>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Users className="h-4 w-4" />
                {connections.length} connection{connections.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Available Positions ({jobs.length})
            </h4>

            <div className="space-y-3">
              {jobs.map((job, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-muted/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium">{job.title}</h5>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills?.slice(0, 5).map((skill, idx) => (
                          <Badge 
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.skills?.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => window.open(job.applyUrl, '_blank')}
                    >
                      Apply
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connections Section */}
          {connections.length > 0 && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span>Your Connections at {company}</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {isExpanded && (
                <div className="space-y-3 pt-3">
                  {connections.map((connection, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {connection.name?.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{connection.name}</h4>
                        {connection.position && (
                          <p className="text-sm text-muted-foreground">
                            {connection.position} at {connection.company}
                          </p>
                        )}
                      </div>

                      {connection.profileUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto"
                          onClick={() => window.open(connection.profileUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}