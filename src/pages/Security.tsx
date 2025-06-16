
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityMonitoring } from '@/components/SecurityMonitoring';
import { SecurityDashboard } from '@/components/SecurityDashboard';
import { ComplianceManager } from '@/components/ComplianceManager';
import { Shield, Activity, FileText, Brain } from 'lucide-react';

const Security = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enterprise Security Center
          </h1>
          <p className="text-gray-600">
            Advanced security monitoring, threat detection, and compliance management
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Security Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Event Monitoring</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Advanced Features</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="monitoring">
            <SecurityMonitoring />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceManager />
          </TabsContent>

          <TabsContent value="advanced">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span>AI Threat Detection</span>
                </h3>
                <p className="text-gray-600 mb-4">
                  Advanced machine learning models continuously analyze content and behavior patterns to detect threats.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time content scanning</li>
                  <li>• Behavioral anomaly detection</li>
                  <li>• Predictive threat analysis</li>
                  <li>• Automated response triggers</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>End-to-End Encryption</span>
                </h3>
                <p className="text-gray-600 mb-4">
                  Client-side encryption ensures your sensitive data remains protected even from server administrators.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• AES-256 encryption</li>
                  <li>• Zero-knowledge architecture</li>
                  <li>• Secure key management</li>
                  <li>• Perfect forward secrecy</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>Role-Based Access Control</span>
                </h3>
                <p className="text-gray-600 mb-4">
                  Granular permission system ensures users only access what they need for their role.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Hierarchical role definitions</li>
                  <li>• Fine-grained permissions</li>
                  <li>• Dynamic access controls</li>
                  <li>• Audit trail integration</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <span>Compliance Automation</span>
                </h3>
                <p className="text-gray-600 mb-4">
                  Automated compliance monitoring and reporting for major regulatory frameworks.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• GDPR compliance tools</li>
                  <li>• SOC 2 monitoring</li>
                  <li>• HIPAA safeguards</li>
                  <li>• Automated reporting</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Security;
