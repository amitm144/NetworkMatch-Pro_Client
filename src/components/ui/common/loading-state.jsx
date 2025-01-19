// components/common/loading-state.jsx
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export function LoadingState({ 
  message = "Loading...",
  className = "h-96",
  icon: Icon = Loader2 
}) {
  return (
    <Card>
      <CardContent className={`flex items-center justify-center ${className}`}>
        <div className="text-center space-y-4">
          <Icon className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-xl text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}