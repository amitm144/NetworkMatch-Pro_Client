import { Building2 } from 'lucide-react';

export function CompanyLogo({ url, companyName }) {
  if (!url) {
    return (
      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
        <Building2 className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img 
      src={url} 
      alt={`${companyName} logo`}
      className="p-4 object-contain rounded-lg w-40 md:w-full  "
    />
  );
}