
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Brain, TrendingUp } from 'lucide-react';
import { SecurityAlert, BehavioralPattern } from '@/services/aiSecurityService';

interface SecurityMetricsCardsProps {
  alerts: SecurityAlert[];
  behavioralPatterns: BehavioralPattern[];
  complianceReport: any;
}

export const SecurityMetricsCards = ({ 
  alerts, 
  behavioralPatterns, 
  complianceReport 
}: SecurityMetricsCardsProps) => {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const openAlerts = alerts.filter(a => a.status === 'open').length;
  const anomalousPatterns = behavioralPatterns.filter(p => p.pattern === 'anomalous').length;

  return (
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
  );
};
