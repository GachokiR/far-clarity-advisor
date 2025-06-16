
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { BehavioralPattern } from '@/services/aiSecurityService';

interface BehavioralAnalyticsTabProps {
  behavioralPatterns: BehavioralPattern[];
}

export const BehavioralAnalyticsTab = ({ behavioralPatterns }: BehavioralAnalyticsTabProps) => {
  const getPatternColor = (pattern: string) => {
    switch (pattern) {
      case 'anomalous': return 'bg-red-100 text-red-800';
      case 'suspicious': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
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
  );
};
