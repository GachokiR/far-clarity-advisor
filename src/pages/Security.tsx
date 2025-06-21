
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityMonitoring } from '@/components/SecurityMonitoring';
import { SecurityDashboard } from '@/components/SecurityDashboard';
import { ComplianceManager } from '@/components/ComplianceManager';
import { SecurityTestingDashboard } from '@/components/SecurityTestingDashboard';
import { SecurityErrorBoundary } from '@/components/SecurityErrorBoundary';
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb-navigation';
import { Shield, Activity, FileText, Brain, TestTube } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Security = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();

  const getTabLabel = (tabValue: string) => {
    switch (tabValue) {
      case 'dashboard': return 'Security Dashboard';
      case 'monitoring': return 'Event Monitoring';
      case 'compliance': return 'Compliance';
      case 'testing': return 'Security Testing';
      case 'advanced': return 'Advanced Features';
      default: return 'Security Center';
    }
  };

  const handleTabNavigation = (tab: string) => {
    setActiveTab(tab);
  };

  const breadcrumbItems = [
    { 
      label: 'Security Center', 
      onClick: () => setActiveTab('dashboard')
    },
    { label: getTabLabel(activeTab) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbNavigation 
          items={breadcrumbItems}
          showDashboardButton={true}
          onTabChange={handleTabNavigation}
          currentPath="/security"
          securityContext={true}
          showHomeButton={false}
        />
        
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Enterprise Security Center
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Advanced security monitoring, threat detection, compliance management, and testing
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className={`${isMobile ? 'flex overflow-x-auto w-full h-auto p-1 space-x-1' : 'grid grid-cols-5'} w-full`}>
            <TabsTrigger 
              value="dashboard" 
              className={`${isMobile ? 'flex-shrink-0 text-xs px-3 py-2' : 'flex items-center space-x-2'}`}
            >
              <Brain className="h-4 w-4" />
              <span className={isMobile ? 'hidden' : 'inline'}>Security Dashboard</span>
              {isMobile && <span>Dashboard</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="monitoring" 
              className={`${isMobile ? 'flex-shrink-0 text-xs px-3 py-2' : 'flex items-center space-x-2'}`}
            >
              <Activity className="h-4 w-4" />
              <span className={isMobile ? 'hidden' : 'inline'}>Event Monitoring</span>
              {isMobile && <span>Monitor</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="compliance" 
              className={`${isMobile ? 'flex-shrink-0 text-xs px-3 py-2' : 'flex items-center space-x-2'}`}
            >
              <FileText className="h-4 w-4" />
              <span className={isMobile ? 'hidden' : 'inline'}>Compliance</span>
              {isMobile && <span>Compliance</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="testing" 
              className={`${isMobile ? 'flex-shrink-0 text-xs px-3 py-2' : 'flex items-center space-x-2'}`}
            >
              <TestTube className="h-4 w-4" />
              <span className={isMobile ? 'hidden' : 'inline'}>Security Testing</span>
              {isMobile && <span>Testing</span>}
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className={`${isMobile ? 'flex-shrink-0 text-xs px-3 py-2' : 'flex items-center space-x-2'}`}
            >
              <Shield className="h-4 w-4" />
              <span className={isMobile ? 'hidden' : 'inline'}>Advanced Features</span>
              {isMobile && <span>Advanced</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SecurityErrorBoundary component="SecurityDashboard">
              <SecurityDashboard onTabChange={handleTabNavigation} />
            </SecurityErrorBoundary>
          </TabsContent>

          <TabsContent value="monitoring">
            <SecurityErrorBoundary component="SecurityMonitoring">
              <SecurityMonitoring />
            </SecurityErrorBoundary>
          </TabsContent>

          <TabsContent value="compliance">
            <SecurityErrorBoundary component="ComplianceManager">
              <ComplianceManager />
            </SecurityErrorBoundary>
          </TabsContent>

          <TabsContent value="testing">
            <SecurityErrorBoundary component="SecurityTestingDashboard">
              <SecurityTestingDashboard onTabChange={handleTabNavigation} />
            </SecurityErrorBoundary>
          </TabsContent>

          <TabsContent value="advanced">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span>AI Threat Detection</span>
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Advanced machine learning models continuously analyze content and behavior patterns to detect threats.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <li>• Real-time content scanning</li>
                  <li>• Behavioral anomaly detection</li>
                  <li>• Predictive threat analysis</li>
                  <li>• Automated response triggers</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>End-to-End Encryption</span>
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Client-side encryption ensures your sensitive data remains protected even from server administrators.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <li>• AES-256 encryption</li>
                  <li>• Zero-knowledge architecture</li>
                  <li>• Secure key management</li>
                  <li>• Perfect forward secrecy</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>Role-Based Access Control</span>
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Granular permission system ensures users only access what they need for their role.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <li>• Hierarchical role definitions</li>
                  <li>• Fine-grained permissions</li>
                  <li>• Dynamic access controls</li>
                  <li>• Audit trail integration</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <span>Compliance Automation</span>
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Automated compliance monitoring and reporting for major regulatory frameworks.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <li>• GDPR compliance tools</li>
                  <li>• SOC 2 monitoring</li>
                  <li>• HIPAA safeguards</li>
                  <li>• Automated reporting</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border col-span-1 md:col-span-2">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center space-x-2">
                  <TestTube className="h-5 w-5 text-indigo-600" />
                  <span>Comprehensive Security Testing</span>
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Automated security testing suite validates all security features and identifies vulnerabilities.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li>• Encryption performance testing</li>
                    <li>• File upload security validation</li>
                    <li>• RBAC functionality testing</li>
                    <li>• AI security analysis testing</li>
                  </ul>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <li>• Browser compatibility checks</li>
                    <li>• Performance benchmarking</li>
                    <li>• Error handling validation</li>
                    <li>• Production readiness assessment</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Security;
