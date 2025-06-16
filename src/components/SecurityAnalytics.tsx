
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SecurityEvent } from '@/utils/securityLogger';

interface SecurityAnalyticsProps {
  securityEvents: SecurityEvent[];
}

export const SecurityAnalytics = ({ securityEvents }: SecurityAnalyticsProps) => {
  const eventsByType = securityEvents.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<SecurityEvent['type'], number>);

  const eventsBySeverity = securityEvents.reduce((acc, event) => {
    acc[event.severity] = (acc[event.severity] || 0) + 1;
    return acc;
  }, {} as Record<SecurityEvent['severity'], number>);

  const formatEventType = (type: SecurityEvent['type']) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Events by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(Object.entries(eventsByType) as [SecurityEvent['type'], number][]).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="text-sm">{formatEventType(type)}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events by Severity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(Object.entries(eventsBySeverity) as [SecurityEvent['severity'], number][]).map(([severity, count]) => (
              <div key={severity} className="flex justify-between">
                <span className="text-sm capitalize">{severity}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
