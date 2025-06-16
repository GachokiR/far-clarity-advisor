
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SecurityTestSuite } from '@/services/securityTestingService';

export class PDFReportService {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  async generateSecurityTestReport(testSuites: SecurityTestSuite[]): Promise<void> {
    this.doc = new jsPDF();
    
    // Header
    this.addHeader('Security Testing Report');
    
    let yPosition = 40;
    
    // Executive Summary
    yPosition = this.addExecutiveSummary(testSuites, yPosition);
    
    // Test Suites Details
    for (const suite of testSuites) {
      yPosition = this.addTestSuite(suite, yPosition);
      
      // Add new page if needed
      if (yPosition > 250) {
        this.doc.addPage();
        yPosition = 20;
      }
    }
    
    this.downloadPDF(`security-test-report-${this.getFormattedDate()}.pdf`);
  }

  async generateComplianceReport(report: any): Promise<void> {
    this.doc = new jsPDF();
    
    // Header
    this.addHeader(`${report.type.toUpperCase()} Compliance Report`);
    
    let yPosition = 40;
    
    // Summary Section
    yPosition = this.addComplianceSummary(report, yPosition);
    
    // Recommendations
    if (report.details?.recommendations?.length > 0) {
      yPosition = this.addRecommendations(report.details.recommendations, yPosition);
    }
    
    // Security Events
    if (report.details?.securityEvents?.length > 0) {
      yPosition = this.addSecurityEvents(report.details.securityEvents, yPosition);
    }
    
    this.downloadPDF(`compliance-report-${report.type}-${this.getFormattedDate()}.pdf`);
  }

  private addHeader(title: string): void {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 20, 20);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    
    // Line separator
    this.doc.line(20, 35, 190, 35);
  }

  private addExecutiveSummary(testSuites: SecurityTestSuite[], yPosition: number): number {
    const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0);
    const passedTests = testSuites.reduce((acc, suite) => 
      acc + suite.tests.filter(test => test.passed).length, 0
    );
    const failedTests = totalTests - passedTests;
    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Executive Summary', 20, yPosition);
    yPosition += 10;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const summaryLines = [
      `Total Test Suites: ${testSuites.length}`,
      `Total Tests: ${totalTests}`,
      `Passed Tests: ${passedTests}`,
      `Failed Tests: ${failedTests}`,
      `Success Rate: ${successRate}%`
    ];

    summaryLines.forEach(line => {
      this.doc.text(line, 30, yPosition);
      yPosition += 6;
    });

    return yPosition + 10;
  }

  private addTestSuite(suite: SecurityTestSuite, yPosition: number): number {
    // Check if we need a new page
    if (yPosition > 220) {
      this.doc.addPage();
      yPosition = 20;
    }

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(suite.name, 20, yPosition);
    yPosition += 8;

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(suite.description, 20, yPosition);
    yPosition += 6;

    this.doc.text(`Status: ${suite.overallStatus.toUpperCase()}`, 20, yPosition);
    this.doc.text(`Execution Time: ${suite.executionTime}ms`, 100, yPosition);
    yPosition += 10;

    // Test results
    suite.tests.forEach(test => {
      if (yPosition > 270) {
        this.doc.addPage();
        yPosition = 20;
      }

      const status = test.passed ? '✓' : '✗';
      const statusColor = test.passed ? [0, 128, 0] : [255, 0, 0];
      
      this.doc.setTextColor(...statusColor);
      this.doc.text(status, 25, yPosition);
      
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(test.testName, 35, yPosition);
      yPosition += 5;
      
      this.doc.setFontSize(8);
      this.doc.text(test.details, 35, yPosition);
      yPosition += 8;
      
      this.doc.setFontSize(9);
    });

    return yPosition + 5;
  }

  private addComplianceSummary(report: any, yPosition: number): number {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Compliance Summary', 20, yPosition);
    yPosition += 10;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const summaryLines = [
      `Framework: ${report.type.toUpperCase()}`,
      `Compliance Score: ${report.summary.complianceScore}%`,
      `Total Security Events: ${report.summary.totalSecurityEvents}`,
      `Critical Alerts: ${report.summary.criticalAlerts}`,
      `Open Incidents: ${report.summary.openIncidents}`
    ];

    summaryLines.forEach(line => {
      this.doc.text(line, 30, yPosition);
      yPosition += 6;
    });

    return yPosition + 10;
  }

  private addRecommendations(recommendations: string[], yPosition: number): number {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Recommendations', 20, yPosition);
    yPosition += 10;

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');

    recommendations.forEach((rec, index) => {
      if (yPosition > 270) {
        this.doc.addPage();
        yPosition = 20;
      }
      
      this.doc.text(`${index + 1}. ${rec}`, 25, yPosition);
      yPosition += 6;
    });

    return yPosition + 10;
  }

  private addSecurityEvents(events: any[], yPosition: number): number {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Recent Security Events', 20, yPosition);
    yPosition += 10;

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');

    events.slice(0, 10).forEach(event => {
      if (yPosition > 270) {
        this.doc.addPage();
        yPosition = 20;
      }
      
      this.doc.text(`${event.type} - ${event.severity}`, 25, yPosition);
      yPosition += 4;
      this.doc.text(new Date(event.timestamp).toLocaleString(), 25, yPosition);
      yPosition += 8;
    });

    return yPosition + 10;
  }

  private downloadPDF(filename: string): void {
    this.doc.save(filename);
  }

  private getFormattedDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}

export const pdfReportService = new PDFReportService();
