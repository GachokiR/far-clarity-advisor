
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface Step {
  label: string;
  status: 'pending' | 'success' | 'error' | 'warn';
  note?: string;
}

const statusIcons = {
  pending: <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />,
  success: <CheckCircle className="h-4 w-4 text-green-500" />,
  error: <AlertTriangle className="h-4 w-4 text-red-500" />,
  warn: <AlertTriangle className="h-4 w-4 text-yellow-500" />
};

interface StatusTrackerProps {
  steps: Step[];
}

export const StatusTracker = ({ steps }: StatusTrackerProps) => {
  return (
    <Card className="w-full max-w-xl mx-auto mb-6 border shadow-md">
      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">📊 Analysis Progress</h3>
        <ul className="space-y-1">
          {steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="mt-1">{statusIcons[step.status]}</span>
              <div>
                <p className="font-medium">{step.label}</p>
                {step.note && <p className="text-muted-foreground text-xs">{step.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
