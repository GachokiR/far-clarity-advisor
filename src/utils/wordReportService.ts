
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import { SecurityTestSuite } from '@/services/securityTestingService';

export class WordReportService {
  async generateSecurityTestReport(testSuites: SecurityTestSuite[]): Promise<void> {
    const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0);
    const passedTests = testSuites.reduce((acc, suite) => 
      acc + suite.tests.filter(test => test.passed).length, 0
    );
    const failedTests = totalTests - passedTests;
    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "Security Testing Report",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          
          // Generated date
          new Paragraph({
            text: `Generated: ${new Date().toLocaleString()}`,
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Executive Summary
          new Paragraph({
            text: "Executive Summary",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Total Test Suites: ", bold: true }),
              new TextRun({ text: testSuites.length.toString() }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Total Tests: ", bold: true }),
              new TextRun({ text: totalTests.toString() }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Passed Tests: ", bold: true }),
              new TextRun({ text: passedTests.toString(), color: "00AA00" }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Failed Tests: ", bold: true }),
              new TextRun({ text: failedTests.toString(), color: "AA0000" }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Success Rate: ", bold: true }),
              new TextRun({ text: `${successRate}%` }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Test Suites
          new Paragraph({
            text: "Test Suite Details",
            heading: HeadingLevel.HEADING_1,
          }),
          
          ...testSuites.flatMap(suite => [
            new Paragraph({
              text: suite.name,
              heading: HeadingLevel.HEADING_2,
            }),
            
            new Paragraph({
              text: suite.description,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Status: ", bold: true }),
                new TextRun({ text: suite.overallStatus.toUpperCase() }),
                new TextRun({ text: " | Execution Time: ", bold: true }),
                new TextRun({ text: `${suite.executionTime}ms` }),
              ],
            }),
            
            new Paragraph({ text: "" }), // Empty line
            
            ...suite.tests.map(test => 
              new Paragraph({
                children: [
                  new TextRun({ 
                    text: test.passed ? "✓ " : "✗ ", 
                    color: test.passed ? "00AA00" : "AA0000",
                    bold: true 
                  }),
                  new TextRun({ text: test.testName, bold: true }),
                  new TextRun({ text: ` - ${test.details}` }),
                ],
              })
            ),
            
            new Paragraph({ text: "" }), // Empty line
          ]),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    this.downloadBlob(blob, `security-test-report-${this.getFormattedDate()}.docx`);
  }

  async generateComplianceReport(report: any): Promise<void> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: `${report.type.toUpperCase()} Compliance Report`,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          
          // Generated date
          new Paragraph({
            text: `Generated: ${new Date().toLocaleString()}`,
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Compliance Summary
          new Paragraph({
            text: "Compliance Summary",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Framework: ", bold: true }),
              new TextRun({ text: report.type.toUpperCase() }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Compliance Score: ", bold: true }),
              new TextRun({ text: `${report.summary.complianceScore}%` }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Total Security Events: ", bold: true }),
              new TextRun({ text: report.summary.totalSecurityEvents.toString() }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Critical Alerts: ", bold: true }),
              new TextRun({ text: report.summary.criticalAlerts.toString() }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Open Incidents: ", bold: true }),
              new TextRun({ text: report.summary.openIncidents.toString() }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Recommendations
          new Paragraph({
            text: "Recommendations",
            heading: HeadingLevel.HEADING_1,
          }),
          
          ...report.details.recommendations.map((rec: string, index: number) =>
            new Paragraph({
              children: [
                new TextRun({ text: `${index + 1}. `, bold: true }),
                new TextRun({ text: rec }),
              ],
            })
          ),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Recent Security Events
          new Paragraph({
            text: "Recent Security Events",
            heading: HeadingLevel.HEADING_1,
          }),
          
          ...report.details.securityEvents.slice(0, 10).flatMap((event: any) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${event.type} - `, bold: true }),
                new TextRun({ text: event.severity.toUpperCase() }),
              ],
            }),
            new Paragraph({
              text: new Date(event.timestamp).toLocaleString(),
            }),
            new Paragraph({ text: "" }), // Empty line
          ]),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    this.downloadBlob(blob, `compliance-report-${report.type}-${this.getFormattedDate()}.docx`);
  }

  async generateFARComplianceReport(analysisResults: any): Promise<void> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "FAR Compliance Analysis Report",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          
          // Generated date
          new Paragraph({
            text: `Generated: ${new Date().toLocaleString()}`,
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Executive Summary
          new Paragraph({
            text: "Executive Summary",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            text: "This report provides a comprehensive analysis of Federal Acquisition Regulation (FAR) compliance requirements based on the uploaded documentation.",
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // FAR Clauses Identified
          new Paragraph({
            text: "FAR Clauses Identified",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "• FAR 52.219-14: ", bold: true }),
              new TextRun({ text: "Limitations on Subcontracting" }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "• FAR 52.204-10: ", bold: true }),
              new TextRun({ text: "Reporting Executive Compensation" }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "• FAR 52.225-13: ", bold: true }),
              new TextRun({ text: "Restrictions on Certain Foreign Purchases" }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Compliance Requirements
          new Paragraph({
            text: "Key Compliance Requirements",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            text: "1. Subcontracting Plan Requirements",
            heading: HeadingLevel.HEADING_2,
          }),
          
          new Paragraph({
            text: "• Establish and maintain a subcontracting plan for small business participation",
          }),
          
          new Paragraph({
            text: "• Document prime contractor performance percentage",
          }),
          
          new Paragraph({
            text: "• Submit quarterly subcontracting reports",
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          new Paragraph({
            text: "2. Executive Compensation Reporting",
            heading: HeadingLevel.HEADING_2,
          }),
          
          new Paragraph({
            text: "• Report executive compensation annually",
          }),
          
          new Paragraph({
            text: "• Maintain compensation documentation",
          }),
          
          new Paragraph({
            text: "• Submit required certifications",
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Risk Assessment
          new Paragraph({
            text: "Risk Assessment",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Low Risk: ", bold: true, color: "00AA00" }),
              new TextRun({ text: "Standard compliance requirements with clear documentation paths" }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Medium Risk: ", bold: true, color: "FFA500" }),
              new TextRun({ text: "Ongoing reporting requirements that need systematic tracking" }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Recommendations
          new Paragraph({
            text: "Recommendations",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            text: "1. Establish a compliance tracking system for ongoing reporting requirements",
          }),
          
          new Paragraph({
            text: "2. Implement quarterly review processes for subcontracting performance",
          }),
          
          new Paragraph({
            text: "3. Create standardized templates for required documentation",
          }),
          
          new Paragraph({
            text: "4. Schedule regular training sessions for compliance team members",
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    this.downloadBlob(blob, `far-compliance-report-${this.getFormattedDate()}.docx`);
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private getFormattedDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}

export const wordReportService = new WordReportService();
