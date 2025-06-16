
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import { SecurityAlert } from '@/services/aiSecurityService';

interface SecurityAlertsTabProps {
  alerts: SecurityAlert[];
  onAlertStatusUpdate: (alertId: string, status: SecurityAlert['status']) => void;
}

export const SecurityAlertsTab = ({ alerts, onAlertStatusUpdate }: SecurityAlertsTabProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Security Alerts</CardTitle>
        <CardDescription>Real-time security incidents and threats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No security alerts detected
            </p>
          ) : (
            alerts.slice(0, 10).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium">{alert.type.replace('_', ' ').toUpperCase()}</div>
                    <div className="text-sm text-muted-foreground">{alert.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <div className="flex space-x-1">
                    {alert.status === 'open' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAlertStatusUpdate(alert.id, 'investigating')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Investigate
                      </Button>
                    )}
                    {alert.status === 'investigating' && (
                      <Button
                        size="sm"
                        onClick={() => onAlertStatusUpdate(alert.id, 'resolved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
