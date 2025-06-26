import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import { SecurityTestSuite } from '@/services/securityTestingService';

export class WordReportService {
  async generateSampleGovernmentContract(): Promise<void> {
    const contractDate = new Date().toLocaleDateString();
    const contractNumber = `W912DY-${new Date().getFullYear()}-C-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "SAMPLE GOVERNMENT CONTRACT",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Contract Information
          new Paragraph({
            text: "CONTRACT INFORMATION",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Contract Number: ", bold: true }),
              new TextRun({ text: contractNumber }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Date: ", bold: true }),
              new TextRun({ text: contractDate }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Contracting Agency: ", bold: true }),
              new TextRun({ text: "U.S. Army Corps of Engineers" }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Contract Type: ", bold: true }),
              new TextRun({ text: "Fixed Price with Economic Price Adjustment" }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Statement of Work
          new Paragraph({
            text: "STATEMENT OF WORK",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            text: "The Contractor shall provide professional engineering services for the design and construction oversight of infrastructure improvements at military installations. Services include preliminary design, detailed engineering plans, environmental compliance assessment, and construction administration."
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // FAR Clauses Section
          new Paragraph({
            text: "FEDERAL ACQUISITION REGULATION (FAR) CLAUSES",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            text: "The following FAR clauses are incorporated by reference:",
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // FAR 52.219-14
          new Paragraph({
            text: "52.219-14 LIMITATIONS ON SUBCONTRACTING",
            heading: HeadingLevel.HEADING_2,
          }),
          
          new Paragraph({
            text: "The offeror agrees to comply with the limitations on subcontracting requirements. At least 50% of the cost of contract performance incurred for personnel shall be expended for employees of the concern."
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Compliance Requirement: ", bold: true }),
              new TextRun({ text: "Submit subcontracting plan and quarterly reports demonstrating compliance with small business subcontracting goals." }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // FAR 52.225-1
          new Paragraph({
            text: "52.225-1 BUY AMERICAN--SUPPLIES",
            heading: HeadingLevel.HEADING_2,
          }),
          
          new Paragraph({
            text: "Only domestic end products will be delivered under this contract except those specifically identified as foreign end products in the schedule."
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Compliance Requirement: ", bold: true }),
              new TextRun({ text: "Certify that all supplies meet Buy American Act requirements and maintain documentation of country of origin." }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // FAR 52.204-21
          new Paragraph({
            text: "52.204-21 BASIC SAFEGUARDING OF COVERED CONTRACTOR INFORMATION SYSTEMS",
            heading: HeadingLevel.HEADING_2,
          }),
          
          new Paragraph({
            text: "The contractor shall provide adequate security for all covered contractor information systems that process, store, or transmit federal contract information."
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Compliance Requirement: ", bold: true }),
              new TextRun({ text: "Implement NIST SP 800-171 security controls and submit System Security Plan (SSP) within 30 days of contract award." }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // FAR 52.204-10
          new Paragraph({
            text: "52.204-10 REPORTING EXECUTIVE COMPENSATION",
            heading: HeadingLevel.HEADING_2,
          }),
          
          new Paragraph({
            text: "The contractor shall report executive compensation information as required by the Federal Funding Accountability and Transparency Act."
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Compliance Requirement: ", bold: true }),
              new TextRun({ text: "Submit annual executive compensation reports and maintain supporting documentation." }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Contract Terms
          new Paragraph({
            text: "CONTRACT TERMS AND CONDITIONS",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Performance Period: ", bold: true }),
              new TextRun({ text: "24 months from date of award" }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Contract Value: ", bold: true }),
              new TextRun({ text: "$2,500,000.00" }),
            ],
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Payment Terms: ", bold: true }),
              new TextRun({ text: "Net 30 days after receipt of properly submitted invoice" }),
            ],
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Deliverables
          new Paragraph({
            text: "KEY DELIVERABLES",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            text: "1. Preliminary Design Report (90 days after award)"
          }),
          
          new Paragraph({
            text: "2. Environmental Assessment (120 days after award)"
          }),
          
          new Paragraph({
            text: "3. Final Design Plans and Specifications (180 days after award)"
          }),
          
          new Paragraph({
            text: "4. Construction Administration Services (ongoing during construction phase)"
          }),
          
          new Paragraph({ text: "" }), // Empty line
          
          // Disclaimer
          new Paragraph({
            text: "SAMPLE DOCUMENT NOTICE",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            text: "This is a sample contract for demonstration purposes only. It is designed to showcase typical FAR compliance requirements and contract structures. This document should not be used for actual contracting purposes.",
            alignment: AlignmentType.CENTER,
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    this.downloadBlob(blob, `sample-government-contract-${this.getFormattedDate()}.docx`);
  }

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
