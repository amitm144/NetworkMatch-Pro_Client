// components/common/empty-state.jsx
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ 
  title = "No Data Found",
  description = "No items to display",
  className = "h-96",
  icon: Icon = AlertCircle,
  action
}) {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
    <Card>
      <CardContent className={`flex items-center justify-center ${className}`}>
        <div className="text-center space-y-4">
          <Icon className="h-12 w-12 text-muted-foreground mx-auto" />
          <div className="space-y-2">
            <p className="text-xl text-muted-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {action && (
            <div className="pt-4">
              {action}
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    </div>

  );
}