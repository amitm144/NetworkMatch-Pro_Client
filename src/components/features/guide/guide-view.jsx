import React from 'react';
import { ArrowRight, Globe, Settings, Database, Clock, Mail, FileSpreadsheet, AlertCircle, Link } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const GuideStep = ({ number, title, description, icon: Icon }) => (
  <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    </div>
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-md font-medium text-blue-600 dark:text-blue-400">Step {number}</span>
        <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-md text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const GuideView = () => {
  const steps = [
    {
      icon: Globe,
      title: "Access LinkedIn",
      description: "Open LinkedIn in your desktop browser. Mobile app won't work for this process."
    },
    {
      icon: Settings,
      title: "Navigate to Settings",
      description: "Click on your profile picture → 'Me' → 'Settings & Privacy'"
    },
    {
      icon: Database,
      title: "Find Data Options",
      description: "Go to 'Data and Privacy' section, then locate 'Get a copy of your data' (usually the second option in the first section)"
    },
    {
      icon: FileSpreadsheet,
      title: "Select Data Type",
      description: "Choose the second radio button option and select 'Connections' from the available data types"
    },
    {
      icon: Clock,
      title: "Processing Time",
      description: "LinkedIn will process your request. This typically takes around 10 minutes"
    },
    {
      icon: Mail,
      title: "Download Data",
      description: "Check your registered email address for the download link from LinkedIn"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Export Your LinkedIn Connections
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose one of the two methods below to download your LinkedIn connections data
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">Quick Method - Direct Link</h3>
          </div>
          <p className="text-md text-gray-600 dark:text-gray-400">
            Visit the LinkedIn data download page directly:
          </p>
          <a 
            href="https://www.linkedin.com/mypreferences/d/download-my-data"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-md"
          >
            linkedin.com/mypreferences/d/download-my-data
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-md text-gray-500 dark:text-gray-400">OR</span>
            <Separator className="flex-1" />
          </div>

          <h3 className="font-medium text-gray-900 dark:text-white">Step-by-Step Method</h3>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {steps.map((step, index) => (
              <GuideStep
                key={index}
                number={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </div>

      <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-700 dark:text-blue-300">
          Once you have your connections CSV file, return here and proceed to the Matching tab to start analyzing your network.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GuideView;