
import { SecurityTestSuite } from '@/services/securityTestingService';
import { SampleContractGenerator } from './reports/SampleContractGenerator';
import { SecurityTestReportGenerator } from './reports/SecurityTestReportGenerator';
import { ComplianceReportGenerator } from './reports/ComplianceReportGenerator';
import { FARComplianceReportGenerator } from './reports/FARComplianceReportGenerator';

export class WordReportService {
  private sampleContractGenerator = new SampleContractGenerator();
  private securityTestReportGenerator = new SecurityTestReportGenerator();
  private complianceReportGenerator = new ComplianceReportGenerator();
  private farComplianceReportGenerator = new FARComplianceReportGenerator();

  async generateSampleGovernmentContract(): Promise<void> {
    return this.sampleContractGenerator.generateSampleGovernmentContract();
  }

  async generateSecurityTestReport(testSuites: SecurityTestSuite[]): Promise<void> {
    return this.securityTestReportGenerator.generateSecurityTestReport(testSuites);
  }

  async generateComplianceReport(report: any): Promise<void> {
    return this.complianceReportGenerator.generateComplianceReport(report);
  }

  async generateFARComplianceReport(analysisResults: any): Promise<void> {
    return this.farComplianceReportGenerator.generateFARComplianceReport(analysisResults);
  }
}

export const wordReportService = new WordReportService();
