import { Briefcase, Building2, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { JobMeta } from './job-meta';
import { JobSkills } from './job-skills';
import { CompanyLogo } from './company-logo';

export function JobCard({ job }) {
  return (
    <Card className="border border-muted rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-4 p-6">
        {/* Logo Section */}
        <div className="flex-shrink-0 flex items-center justify-center md:w-40 md:h-40 w-full h-16  rounded-lg md:self-center">
          <CompanyLogo url={job.logoUrl} companyName={job.company} />
        </div>

        {/* Details Section */}
        <div className="flex-1 space-y-4">
          {/* Title and Company */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Briefcase className="h-5 w-5 text-primary" />
              {job.title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {job.company}
            </p>
          </div>

          {/* Job Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {job.meta?.location && (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                {job.meta.location}
              </span>
            )}
            {job.postedDate?.original && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                {job.postedDate.original}
              </span>
            )}
          </div>

          {/* Skills */}
          <JobSkills skills={job.skills} />
        </div>

        {/* Apply Button */}
        <div className="self-center w-full md:w-auto  mt-8 md:mt-0 ">
          <Button
            size="lg"
            className="w-full md:w-auto bg-primary text-white hover:bg-primary-dark transition-transform transform hover:scale-105"
            onClick={() => window.open(job.applyUrl, '_blank')}
            aria-label={`Apply for ${job.title} at ${job.company}`}
          >
            Apply Now
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile-Friendly Sticky Footer for Apply Button */}

    </Card>
  );
}
