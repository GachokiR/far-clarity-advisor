
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export const ThreatDetectionTab = () => {
  return (
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
  );
};
