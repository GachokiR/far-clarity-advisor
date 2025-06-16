import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Brain, 
  FileText, 
  Users, 
  TrendingUp,
  Download,
  Eye,
  CheckCircle
} from 'lucide-react';
import { aiSecurityService, SecurityAlert, BehavioralPattern } from '@/services/aiSecurityService';
import { securityLogger } from '@/utils/securityLogger';
import { useToast } from '@/hooks/use-toast';
import { SecurityErrorBoundary } from './SecurityErrorBoundary';
import { SecurityDashboardLoading } from './SecurityLoadingStates';

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPatternColor = (pattern: string) => {
    switch (pattern) {
      case 'anomalous': return 'bg-red-100 text-red-800';
      case 'suspicious': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const openAlerts = alerts.filter(a => a.status === 'open').length;
  const anomalousPatterns = behavioralPatterns.filter(p => p.pattern === 'anomalous').length;

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
          <Button onClick={() => setRefreshKey(prev => prev + 1)} variant="outline">
            Refresh Data
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Alerts</CardTitle>
              <Shield className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{openAlerts}</div>
              <p className="text-xs text-muted-foreground">Pending investigation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Behavioral Anomalies</CardTitle>
              <Brain className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{anomalousPatterns}</div>
              <p className="text-xs text-muted-foreground">AI-detected patterns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {complianceReport?.summary?.complianceScore || 0}%
              </div>
              <p className="text-xs text-muted-foreground">SOC 2 compliance</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
            <TabsTrigger value="behavior">Behavioral Analysis</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="threats">Threat Detection</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <SecurityErrorBoundary component="SecurityAlerts">
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
                                  onClick={() => handleAlertStatusUpdate(alert.id, 'investigating')}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Investigate
                                </Button>
                              )}
                              {alert.status === 'investigating' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleAlertStatusUpdate(alert.id, 'resolved')}
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
            </SecurityErrorBoundary>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Analytics</CardTitle>
                <CardDescription>AI-powered user behavior analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {behavioralPatterns.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No behavioral patterns detected
                    </p>
                  ) : (
                    behavioralPatterns.slice(0, 10).map((pattern, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5" />
                          <div>
                            <div className="font-medium">User: {pattern.userId.slice(0, 8)}...</div>
                            <div className="text-sm text-muted-foreground">
                              Risk Score: {pattern.riskScore.toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(pattern.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge className={getPatternColor(pattern.pattern)}>
                          {pattern.pattern}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Report</CardTitle>
                <CardDescription>Current compliance status and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {complianceReport && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-1">Security Events</h4>
                        <p className="text-2xl font-bold text-blue-700">
                          {complianceReport.summary.totalSecurityEvents}
                        </p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-medium text-red-900 mb-1">Critical Alerts</h4>
                        <p className="text-2xl font-bold text-red-700">
                          {complianceReport.summary.criticalAlerts}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-1">Compliance Score</h4>
                        <p className="text-2xl font-bold text-green-700">
                          {complianceReport.summary.complianceScore}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {complianceReport.details.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Threat Detection</CardTitle>
                <CardDescription>AI-powered threat analysis and prevention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Content Security</h4>
                      <p className="text-sm text-green-800">
                        AI models actively scan all uploaded content for malicious patterns and threats.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Behavioral Monitoring</h4>
                      <p className="text-sm text-blue-800">
                        Machine learning algorithms detect anomalous user behavior patterns.
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced AI Protection</h3>
                    <p className="text-gray-600">
                      Your system is protected by advanced AI security models that continuously learn and adapt.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SecurityErrorBoundary>
  );
};
