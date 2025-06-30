
import { Loader2 } from "lucide-react";

interface AppLoaderProps {
  message?: string;
}

export const AppLoader = ({ message = "Loading..." }: AppLoaderProps) => {
  console.log('AppLoader rendering with message:', message);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600 text-lg">{message}</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we set up your experience</p>
      </div>
    </div>
  );
};
