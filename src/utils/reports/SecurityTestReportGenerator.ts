
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { SecurityTestSuite } from '@/services/securityTestingService';
import { BaseReportService } from './BaseReportService';

export class SecurityTestReportGenerator extends BaseReportService {
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
}
