
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { BaseReportService } from './BaseReportService';

export class SampleContractGenerator extends BaseReportService {
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
            text: "This is a sample contract for testing purposes only. It is designed to showcase typical FAR compliance requirements and contract structures. This document should not be used for actual contracting purposes.",
            alignment: AlignmentType.CENTER,
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    this.downloadBlob(blob, `sample-government-contract-${this.getFormattedDate()}.docx`);
  }
}
