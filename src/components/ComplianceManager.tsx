
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  Lock,
  Database,
  Users,
  Activity
} from 'lucide-react';
import { aiSecurityService } from '@/services/aiSecurityService';
import { useToast } from '@/hooks/use-toast';

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  requirements: ComplianceRequirement[];
  score: number;
  status: 'compliant' | 'non_compliant' | 'in_progress';
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: 'access_control' | 'data_protection' | 'audit_logging' | 'incident_response';
  status: 'met' | 'partial' | 'not_met';
  evidence: string[];
  lastReviewed: string;
}

export const ComplianceManager = () => {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('gdpr');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    initializeComplianceData();
  }, []);

  const initializeComplianceData = () => {
    const gdprFramework: ComplianceFramework = {
      id: 'gdpr',
      name: 'GDPR (General Data Protection Regulation)',
      description: 'EU data protection and privacy regulation',
      score: 85,
      status: 'in_progress',
      requirements: [
        {
          id: 'gdpr_1',
          title: 'Data Processing Consent',
          description: 'Obtain explicit consent for data processing',
          category: 'data_protection',
          status: 'met',
          evidence: ['Consent forms implemented', 'Audit logs available'],
          lastReviewed: new Date().toISOString()
        },
        {
          id: 'gdpr_2',
          title: 'Right to be Forgotten',
          description: 'Implement data deletion capabilities',
          category: 'data_protection',
          status: 'partial',
          evidence: ['Data deletion API implemented'],
          lastReviewed: new Date().toISOString()
        },
        {
          id: 'gdpr_3',
          title: 'Data Portability',
          description: 'Enable users to export their data',
          category: 'data_protection',
          status: 'not_met',
          evidence: [],
          lastReviewed: new Date().toISOString()
        },
        {
          id: 'gdpr_4',
          title: 'Data Breach Notification',
          description: 'Notify authorities within 72 hours of breach',
          category: 'incident_response',
          status: 'met',
          evidence: ['Automated notification system', 'Incident response plan'],
          lastReviewed: new Date().toISOString()
        }
      ]
    };

    const soc2Framework: ComplianceFramework = {
      id: 'soc2',
      name: 'SOC 2 Type II',
      description: 'Service organization control for security, availability, and confidentiality',
      score: 92,
      status: 'compliant',
      requirements: [
        {
          id: 'soc2_1',
          title: 'Access Controls',
          description: 'Implement logical and physical access controls',
          category: 'access_control',
          status: 'met',
          evidence: ['RBAC implemented', 'MFA enabled', 'Access logs'],
          lastReviewed: new Date().toISOString()
        },
        {
          id: 'soc2_2',
          title: 'System Monitoring',
          description: 'Continuous monitoring of system activities',
          category: 'audit_logging',
          status: 'met',
          evidence: ['Real-time monitoring', 'Security event logging', 'Alerting system'],
          lastReviewed: new Date().toISOString()
        },
        {
          id: 'soc2_3',
          title: 'Change Management',
          description: 'Formal change management processes',
          category: 'access_control',
          status: 'met',
          evidence: ['Change approval workflow', 'Version control', 'Testing procedures'],
          lastReviewed: new Date().toISOString()
        },
        {
          id: 'soc2_4',
          title: 'Data Encryption',
          description: 'Encrypt data at rest and in transit',
          category: 'data_protection',
          status: 'met',
          evidence: ['TLS encryption', 'Database encryption', 'Key management'],
          lastReviewed: new Date().toISOString()
        }
      ]
    };

    const hipaaFramework: ComplianceFramework = {
      id: 'hipaa',
      name: 'HIPAA (Health Insurance Portability and Accountability Act)',
      description: 'US healthcare data protection regulation',
      score: 78,
      status: 'in_progress',
      requirements: [
        {
          id: 'hipaa_1',
          title: 'PHI Encryption',
          description: 'Encrypt protected health information',
          category: 'data_protection',
          status: 'met',
          evidence: ['End-to-end encryption', 'Key management system'],
          lastReviewed: new Date().toISOString()
        },
        {
          id: 'hipaa_2',
          title: 'Access Logging',
          description: 'Log all access to PHI',
          category: 'audit_logging',
          status: 'met',
          evidence: ['Comprehensive audit logs', 'User activity tracking'],
          lastReviewed: new Date().toISOString()
        },
        {
          id: 'hipaa_3',
          title: 'Business Associate Agreements',
          description: 'Establish BAAs with third parties',
          category: 'access_control',
          status: 'partial',
          evidence: ['Some BAAs in place'],
          lastReviewed: new Date().toISOString()
        },
        {
          id: 'hipaa_4',
          title: 'Risk Assessment',
          description: 'Regular security risk assessments',
          category: 'audit_logging',
          status: 'not_met',
          evidence: [],
          lastReviewed: new Date().toISOString()
        }
      ]
    };

    setFrameworks([gdprFramework, soc2Framework, hipaaFramework]);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'not_met': return 'bg-red-100 text-red-800';
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'non_compliant': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'access_control': return <Users className="h-4 w-4" />;
      case 'data_protection': return <Lock className="h-4 w-4" />;
      case 'audit_logging': return <Activity className="h-4 w-4" />;
      case 'incident_response': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const generateComplianceReport = async (frameworkId: string) => {
    try {
      const report = await aiSecurityService.generateComplianceReport(frameworkId as any);
      toast({
        title: "Report Generated",
        description: `Compliance report for ${frameworkId.toUpperCase()} has been generated.`,
      });
      // In a real app, this would trigger a download
      console.log('Generated report:', report);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate compliance report.",
        variant: "destructive"
      });
    }
  };

  const currentFramework = frameworks.find(f => f.id === selectedFramework);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Compliance Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage regulatory compliance
          </p>
        </div>
        <Button onClick={() => generateComplianceReport(selectedFramework)}>
          <Download className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Framework Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {frameworks.map((framework) => (
          <Card 
            key={framework.id}
            className={`cursor-pointer transition-all ${
              selectedFramework === framework.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedFramework(framework.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{framework.name}</CardTitle>
                <Badge className={getStatusColor(framework.status)}>
                  {framework.status.replace('_', ' ')}
                </Badge>
              </div>
              <CardDescription>{framework.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Compliance Score</span>
                  <span className="font-medium">{framework.score}%</span>
                </div>
                <Progress value={framework.score} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Framework View */}
      {currentFramework && (
        <Tabs defaultValue="requirements" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="actions">Action Items</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{currentFramework.name} Requirements</CardTitle>
                <CardDescription>
                  Detailed compliance requirements and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentFramework.requirements.map((requirement) => (
                    <div
                      key={requirement.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        {getCategoryIcon(requirement.category)}
                        <div className="flex-1">
                          <div className="font-medium">{requirement.title}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {requirement.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last reviewed: {new Date(requirement.lastReviewed).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(requirement.status)}>
                        {requirement.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evidence" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Evidence</CardTitle>
                <CardDescription>
                  Documentation and evidence supporting compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentFramework.requirements.map((requirement) => (
                    <div key={requirement.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{requirement.title}</h4>
                      {requirement.evidence.length > 0 ? (
                        <ul className="space-y-1">
                          {requirement.evidence.map((evidence, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{evidence}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No evidence documented</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>
                  Required actions to improve compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentFramework.requirements
                    .filter(req => req.status !== 'met')
                    .map((requirement) => (
                      <div
                        key={requirement.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="font-medium">{requirement.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {requirement.status === 'partial' 
                                ? 'Partially implemented - requires completion'
                                : 'Not implemented - action required'
                              }
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(requirement.status)}>
                          {requirement.status === 'partial' ? 'In Progress' : 'To Do'}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
