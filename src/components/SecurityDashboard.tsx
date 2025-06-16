
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { aiSecurityService, SecurityAlert, BehavioralPattern } from '@/services/aiSecurityService';
import { useToast } from '@/hooks/use-toast';
import { SecurityErrorBoundary } from './SecurityErrorBoundary';
import { SecurityDashboardLoading } from './SecurityLoadingStates';
import { SecurityMetricsCards } from './security/SecurityMetricsCards';
import { SecurityAlertsTab } from './security/SecurityAlertsTab';
import { BehavioralAnalyticsTab } from './security/BehavioralAnalyticsTab';
import { ComplianceReportTab } from './security/ComplianceReportTab';
import { ThreatDetectionTab } from './security/ThreatDetectionTab';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SecurityDashboard = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [behavioralPatterns, setBehavioralPatterns] = useState<BehavioralPattern[]>([]);
  const [complianceReport, setComplianceReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, [refreshKey]);

  const loadDashboardData = async () => {
    try {
      const alertsData = aiSecurityService.getSecurityAlerts();
      const patternsData = aiSecurityService.getBehavioralPatterns();
      const reportData = await aiSecurityService.generateComplianceReport('soc2');

      setAlerts(alertsData);
      setBehavioralPatterns(patternsData);
      setComplianceReport(reportData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load security dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAlertStatusUpdate = (alertId: string, status: SecurityAlert['status']) => {
    aiSecurityService.updateAlertStatus(alertId, status);
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Alert Updated",
      description: `Alert status changed to ${status}.`,
    });
  };

  if (loading) {
    return <SecurityDashboardLoading />;
  }

  return (
    <SecurityErrorBoundary component="SecurityDashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Security Dashboard</h2>
            <p className="text-muted-foreground">
              Advanced security monitoring and threat detection
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            <Button onClick={() => setRefreshKey(prev => prev + 1)} variant="outline">
              Refresh Data
            </Button>
          </div>
        </div>

        <SecurityMetricsCards 
          alerts={alerts}
          behavioralPatterns={behavioralPatterns}
          complianceReport={complianceReport}
        />

        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
            <TabsTrigger value="behavior">Behavioral Analysis</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="threats">Threat Detection</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <SecurityErrorBoundary component="SecurityAlerts">
              <SecurityAlertsTab 
                alerts={alerts}
                onAlertStatusUpdate={handleAlertStatusUpdate}
              />
            </SecurityErrorBoundary>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <BehavioralAnalyticsTab behavioralPatterns={behavioralPatterns} />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <ComplianceReportTab complianceReport={complianceReport} />
          </TabsContent>

          <TabsContent value="threats" className="space-y-4">
            <ThreatDetectionTab />
          </TabsContent>
        </Tabs>
      </div>
    </SecurityErrorBoundary>
  );
};
