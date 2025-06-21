
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
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface SecurityDashboardProps {
  onTabChange?: (tab: string) => void;
}

export const SecurityDashboard = ({ onTabChange }: SecurityDashboardProps) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [behavioralPatterns, setBehavioralPatterns] = useState<BehavioralPattern[]>([]);
  const [complianceReport, setComplianceReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
      <div className="space-y-4 sm:space-y-6">
        <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between'}`}>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Security Dashboard</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Advanced security monitoring and threat detection
            </p>
          </div>
          <div className={`${isMobile ? 'flex flex-wrap gap-2' : 'flex items-center space-x-2'}`}>
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={() => onTabChange ? onTabChange('monitoring') : navigate('/security')}
              className={`${isMobile ? 'text-xs px-2 py-1' : ''} flex items-center space-x-1`}
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className={isMobile ? 'hidden sm:inline' : 'inline'}>Back to Security</span>
              {isMobile && <span className="sm:hidden">Back</span>}
            </Button>
            <Button 
              onClick={() => setRefreshKey(prev => prev + 1)} 
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className={isMobile ? 'text-xs px-2 py-1' : ''}
            >
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
          <TabsList className={`${isMobile ? 'flex overflow-x-auto w-full h-auto p-1 space-x-1' : 'grid grid-cols-4'} w-full`}>
            <TabsTrigger 
              value="alerts" 
              className={isMobile ? 'flex-shrink-0 text-xs px-3 py-2' : ''}
            >
              {isMobile ? 'Alerts' : 'Security Alerts'}
            </TabsTrigger>
            <TabsTrigger 
              value="behavior" 
              className={isMobile ? 'flex-shrink-0 text-xs px-3 py-2' : ''}
            >
              {isMobile ? 'Behavior' : 'Behavioral Analysis'}
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className={isMobile ? 'flex-shrink-0 text-xs px-3 py-2' : ''}
            >
              Compliance
            </TabsTrigger>
            <TabsTrigger 
              value="threats" 
              className={isMobile ? 'flex-shrink-0 text-xs px-3 py-2' : ''}
            >
              {isMobile ? 'Threats' : 'Threat Detection'}
            </TabsTrigger>
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
