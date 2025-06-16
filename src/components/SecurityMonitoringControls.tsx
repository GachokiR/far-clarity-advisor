
import { Button } from '@/components/ui/button';

interface SecurityMonitoringControlsProps {
  onRefresh: () => void;
  onClearEvents: () => void;
}

export const SecurityMonitoringControls = ({ onRefresh, onClearEvents }: SecurityMonitoringControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Security Monitoring</h2>
        <p className="text-muted-foreground">
          Monitor security events and system health
        </p>
      </div>
      <div className="space-x-2">
        <Button onClick={onRefresh} variant="outline">
          Refresh
        </Button>
        <Button onClick={onClearEvents} variant="destructive">
          Clear All
        </Button>
      </div>
    </div>
  );
};
