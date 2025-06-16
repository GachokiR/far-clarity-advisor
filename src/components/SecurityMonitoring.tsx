
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { securityLogger, SecurityEvent } from '@/utils/securityLogger';
import { logger } from '@/utils/productionLogger';
import { SecurityMonitoringStats } from '@/components/SecurityMonitoringStats';
import { SecurityEventsList } from '@/components/SecurityEventsList';
import { SecurityAnalytics } from '@/components/SecurityAnalytics';
import { SecurityMonitoringControls } from '@/components/SecurityMonitoringControls';

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

  return (
    <div className="space-y-6">
      <SecurityMonitoringControls onRefresh={refresh} onClearEvents={clearEvents} />

      <SecurityMonitoringStats securityEvents={securityEvents} />

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <SecurityEventsList securityEvents={securityEvents} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SecurityAnalytics securityEvents={securityEvents} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
