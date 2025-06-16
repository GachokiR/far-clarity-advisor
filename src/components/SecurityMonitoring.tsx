
import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { securityLogger, SecurityEvent } from '@/utils/securityLogger';
import { logger } from '@/utils/productionLogger';

export const SecurityMonitoring = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setSecurityEvents(securityLogger.getEvents());
  }, [refreshKey]);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const clearEvents = () => {
    securityLogger.clearEvents();
    logger.clearLogs();
    setRefreshKey(prev => prev + 1);
  };

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

  const eventsByType = securityEvents.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventsBySeverity = securityEvents.reduce((acc, event) => {
    acc[event.severity] = (acc[event.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Monitoring</h2>
          <p className="text-muted-foreground">
            Monitor security events and system health
          </p>
        </div>
        <div className="space-x-2">
          <Button onClick={refresh} variant="outline">
            Refresh
          </Button>
          <Button onClick={clearEvents} variant="destructive">
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityEvents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {eventsBySeverity.critical || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auth Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(eventsByType.auth_success || 0) + (eventsByType.auth_failure || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limits</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventsByType.rate_limit_exceeded || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Events by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(eventsByType).map(([type, count]) => (
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
                  {Object.entries(eventsBySeverity).map(([severity, count]) => (
                    <div key={severity} className="flex justify-between">
                      <span className="text-sm capitalize">{severity}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
