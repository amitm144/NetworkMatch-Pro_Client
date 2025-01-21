import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Building2,
  Users,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  GraduationCap
} from 'lucide-react';
import { useState } from 'react';
import { AnimatedButton } from "@/components/ui/animated-button";

const JobCard = ({ job }) => {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const displaySkills = showAllSkills ? job.skills : job.skills?.slice(0, 3);

  return (
    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className="font-medium text-base">{job.title}</h5>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {displaySkills?.map((skill, idx) => (
              <Badge 
                key={idx}
                variant="secondary"
                className="text-xs px-2 py-0.5"
              >
                {skill}
              </Badge>
            ))}
            {!showAllSkills && job.skills?.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-2 text-xs"
                onClick={() => setShowAllSkills(true)}
              >
                +{job.skills.length - 3} more
              </Button>
            )}
          </div>
        </div>
        <AnimatedButton
          url={job.applyUrl}
          text="Apply"
          icon="✍🏼"
          className="ml-4"
        >
          View Profile
        </AnimatedButton>
      </div>
    </div>
  );
};

export function MatchCard({ match }) {
  const [isExpandedJobs, setIsExpandedJobs] = useState(false);
  const [isExpandedConnections, setIsExpandedConnections] = useState(false);
  
  if (!match) return null;
  const { company, jobs = [], connections = [], logo } = match;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Company Information */}
          <div className="flex items-start gap-4">
            {logo ? (
              <img 
                src={logo} 
                alt={`${company} logo`}
                className="w-16 h-16 object-contain rounded-lg bg-white p-2 shadow-sm"
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

          {/* Jobs Section */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between group hover:bg-primary/5"
              onClick={() => setIsExpandedJobs(!isExpandedJobs)}
            >
              <span className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Available Positions ({jobs.length})
                </span>
              </span>
              {isExpandedJobs ? (
                <ChevronUp className="h-4 w-4 group-hover:text-primary transition-colors" />
              ) : (
                <ChevronDown className="h-4 w-4 group-hover:text-primary transition-colors" />
              )}
            </Button>

            {isExpandedJobs && (
              <div className="space-y-2 mt-2">
                {jobs.map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* Connections Section */}
          {connections.length > 0 && (
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between group hover:bg-primary/5"
                onClick={() => setIsExpandedConnections(!isExpandedConnections)}
              >
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    Your Connections at {company}
                  </span>
                </span>
                {isExpandedConnections ? (
                  <ChevronUp className="h-4 w-4 group-hover:text-primary transition-colors" />
                ) : (
                  <ChevronDown className="h-4 w-4 group-hover:text-primary transition-colors" />
                )}
              </Button>

              {isExpandedConnections && (
                <div className="space-y-2 mt-2">
                  {connections.map((connection, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-base font-semibold text-primary">
                          {connection.name?.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{connection.name}</h4>
                        {connection.position && (
                          <p className="text-sm text-muted-foreground truncate">
                            {connection.position} at {connection.company}
                          </p>
                        )}
                      </div>

                      {connection.profileUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
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