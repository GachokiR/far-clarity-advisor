import { Button } from "@/components/ui/button";
import { HelpCircle, TestTube } from "lucide-react";

interface DashboardHeaderProps {
  onRestartTour: () => void;
  onToggleTestRunner: () => void;
}

export const DashboardHeader = ({ onRestartTour, onToggleTestRunner }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome to Compliance Pro</h2>
        <p className="text-muted-foreground">
          Your comprehensive FAR compliance and security management platform
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={onRestartTour}
          className="flex items-center space-x-2"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Restart Tour</span>
        </Button>
        <Button
          variant="outline"
          onClick={onToggleTestRunner}
          className="flex items-center space-x-2"
        >
          <TestTube className="h-4 w-4" />
          <span>Test Navigation</span>
        </Button>
      </div>
    </div>
  );
};