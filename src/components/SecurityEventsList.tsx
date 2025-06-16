
import { Shield, AlertTriangle, Activity, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SecurityEvent } from '@/utils/securityLogger';

interface SecurityEventsListProps {
  securityEvents: SecurityEvent[];
}

export const SecurityEventsList = ({ securityEvents }: SecurityEventsListProps) => {
  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'auth_attempt':
      case 'auth_success':
      case 'auth_failure':
        return <Shield className="h-4 w-4" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4" />;
      case 'rate_limit_exceeded':
        return <Activity className="h-4 w-4" />;
      case 'session_timeout':
        return <Clock className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const formatEventType = (type: SecurityEvent['type']) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Events</CardTitle>
        <CardDescription>
          Recent security events and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {securityEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No security events recorded
            </p>
          ) : (
            securityEvents.slice(-10).reverse().map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getEventIcon(event.type)}
                  <div>
                    <div className="font-medium">
                      {formatEventType(event.type)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                    {Object.keys(event.details).length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {JSON.stringify(event.details, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={getSeverityColor(event.severity)}>
                  {event.severity}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
