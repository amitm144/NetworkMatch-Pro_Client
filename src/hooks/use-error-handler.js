// hooks/use-error-handler.js
import { useToast } from "@/hooks/use-toast";
import { useSession } from "./use-session";

export function useErrorHandler() {
  const { toast } = useToast();
  const { clearSession } = useSession();

  return async (error, options = {}) => {
    const {
      title = "Error",
      defaultMessage = "An error occurred",
      clearSession: shouldClearSession = false
    } = options;

    toast({
      variant: "destructive",
      title,
      description: error.message || defaultMessage,
    });

    if (shouldClearSession) {
      await clearSession();
    }

    return error;
  };
}