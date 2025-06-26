
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { BaseReportService } from './BaseReportService';

export class ComplianceReportGenerator extends BaseReportService {
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
}
