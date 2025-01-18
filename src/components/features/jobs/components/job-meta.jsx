import { Users, Briefcase } from 'lucide-react';

export function JobMeta({ meta }) {
  if (!meta) return null;

  const metaItems = [
    { 
      label: 'Company Size', 
      value: meta.companySize,
      icon: Users
    },
    { 
      label: 'Industry', 
      value: meta.industry,
      icon: Briefcase
    }
  ].filter(item => item.value);

  if (metaItems.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-6 text-base text-muted-foreground">
      {metaItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span className="font-medium">{item.label}:</span> {item.value}
          </div>
        );
      })}
    </div>
  );
}