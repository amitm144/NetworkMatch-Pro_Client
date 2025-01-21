// components/common/empty-state.jsx
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ 
  title,
  description ,
  className = "h-96",
  icon: Icon ,
  action,
  children
}) {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className={`flex items-center justify-center ${className}`}>
          <div className="text-center space-y-4 w-full">
            {Icon && <Icon className="h-12 w-12 text-muted-foreground mx-auto" />}
            <div className="space-y-2">
              <p className="text-xl text-black font-bold">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            {action && (
              <div className="pt-4">
                {action}
              </div>
            )}
            {children && (
              <div className="pt-4 w-full">
                {children}
              </div>
            )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}