
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { BaseReportService } from './BaseReportService';

export class FARComplianceReportGenerator extends BaseReportService {
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
}
