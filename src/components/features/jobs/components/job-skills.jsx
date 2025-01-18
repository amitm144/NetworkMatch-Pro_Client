import { Badge } from "@/components/ui/badge";

export function JobSkills({ skills }) {
  if (!skills?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <Badge 
          key={index} 
          variant="secondary"
          className="px-3 py-1 text-sm font-medium hover:bg-secondary/80 transition-colors cursor-default"
        >
          {skill}
        </Badge>
      ))}
    </div>
  );
}