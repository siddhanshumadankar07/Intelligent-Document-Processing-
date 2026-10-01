const PDFDocument = require('pdfkit');

/**
 * Generates a clean, branded PDF summary report of the entire session before permanent deletion.
 */
const generateSessionExportPDF = async ({ session, user, documents = [], chatMessages = [], insights = {} }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4',
        info: {
          Title: `Clause Session Export - ${new Date().toLocaleDateString()}`,
          Author: 'Clause Intelligent Document Processing',
          Subject: 'Zero-Retention Session Summary & Audit Report',
        }
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Brand Palette
      const primaryColor = '#14B8A6'; // Teal
      const darkColor = '#0F172A';    // Slate 900
      const mutedColor = '#64748B';   // Slate 500
      const accentViolet = '#7C3AED'; // Violet
      const lightBg = '#F8FAFC';

      // --- HEADER ---
      doc.rect(40, 40, 515, 60).fill('#0B1020');

      doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text('CLAUSE', 55, 52);
      doc.fontSize(10).font('Helvetica').fillColor(primaryColor).text('INTELLIGENT DOCUMENT PROCESSING • ZERO-RETENTION CERTIFIED', 55, 76);

      doc.fillColor('#94A3B8').fontSize(9).font('Helvetica').text(
        `Session Export: ${new Date().toUTCString()}\nUser: ${user.name} (${user.profession || 'Professional'})`,
        360,
        52,
        { align: 'right' }
      );

      doc.moveDown(3);

      // --- PRIVACY NOTICE BANNER ---
      const bannerTop = 115;
      doc.roundedRect(40, bannerTop, 515, 45, 6).fill('#F0FDFA');
      doc.rect(40, bannerTop, 4, 45).fill(primaryColor);
      doc.fillColor('#0F766E').fontSize(10).font('Helvetica-Bold').text('PRIVACY & ZERO-RETENTION NOTICE', 55, bannerTop + 8);
      doc.fillColor('#134E4A').fontSize(8.5).font('Helvetica').text(
        'This document is your permanent record. All raw files, extracted text, and chat sessions have been permanently expunged from Clause servers upon delivery of this file.',
        55,
        bannerTop + 24,
        { width: 480 }
      );

      // --- SESSION SUMMARY STATS ---
      let y = 175;
      doc.fontSize(13).font('Helvetica-Bold').fillColor(darkColor).text('Session Overview & Insights', 40, y);
      y += 20;

      const statBoxWidth = 120;
      const stats = [
        { label: 'Documents', val: documents.length.toString() },
        { label: 'Avg Confidence', val: `${insights.avgConfidence || 92}%` },
        { label: 'Approved', val: documents.filter((d) => d.status === 'Approved').length.toString() },
        { label: 'Action Flags', val: documents.reduce((acc, d) => acc + (d.flags?.length || 0), 0).toString() }
      ];

      stats.forEach((s, idx) => {
        const bx = 40 + idx * (statBoxWidth + 10);
        doc.roundedRect(bx, y, statBoxWidth, 48, 6).fill('#F1F5F9');
        doc.fillColor(mutedColor).fontSize(8).font('Helvetica').text(s.label.toUpperCase(), bx + 10, y + 8);
        doc.fillColor(darkColor).fontSize(16).font('Helvetica-Bold').text(s.val, bx + 10, y + 22);
      });

      y += 65;

      // --- PROCESSED DOCUMENTS SECTION ---
      doc.fontSize(13).font('Helvetica-Bold').fillColor(darkColor).text('Processed Documents & Extracted Fields', 40, y);
      y += 20;

      if (documents.length === 0) {
        doc.fontSize(9.5).font('Helvetica-Oblique').fillColor(mutedColor).text('No documents were uploaded in this session.', 40, y);
        y += 25;
      } else {
        documents.forEach((docItem, index) => {
          // Check page boundary
          if (y > 680) {
            doc.addPage();
            y = 40;
          }

          // Document Card
          doc.roundedRect(40, y, 515, 26, 4).fill('#E2E8F0');
          doc.fillColor(darkColor).fontSize(10).font('Helvetica-Bold').text(
            `${index + 1}. ${docItem.fileName}`,
            50,
            y + 7
          );
          doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text(
            `${docItem.type.toUpperCase()} • ${docItem.confidence}% Confidence • [${docItem.status}]`,
            300,
            y + 7,
            { align: 'right', width: 245 }
          );

          y += 34;

          // Summary
          doc.fontSize(9).font('Helvetica-Bold').fillColor(darkColor).text('Executive Summary:', 45, y);
          doc.fontSize(8.5).font('Helvetica').fillColor('#334155').text(docItem.summary || 'N/A', 145, y, { width: 400 });
          y += 24;

          // Extracted Fields Table
          const entries = Object.entries(docItem.extractedData || {});
          if (entries.length > 0) {
            doc.fontSize(8.5).font('Helvetica-Bold').fillColor(mutedColor).text('EXTRACTED DATA:', 45, y);
            y += 12;

            entries.slice(0, 10).forEach(([key, val]) => {
              if (y > 740) {
                doc.addPage();
                y = 40;
              }
              const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
              doc.fillColor(mutedColor).fontSize(8).font('Helvetica').text(`• ${key.replace(/_/g, ' ')}:`, 55, y);
              doc.fillColor(darkColor).fontSize(8).font('Courier').text(displayVal.slice(0, 80), 180, y, { width: 360 });
              y += 13;
            });
          }

          // Flags
          if (docItem.flags && docItem.flags.length > 0) {
            doc.fillColor('#DC2626').fontSize(8.5).font('Helvetica-Bold').text('Flags / Review Items:', 45, y);
            y += 12;
            docItem.flags.forEach((f) => {
              doc.fillColor('#B91C1C').fontSize(8).font('Helvetica').text(`- [${f.type.toUpperCase()}] ${f.message}: ${f.explanation}`, 55, y, { width: 490 });
              y += 14;
            });
          }

          y += 15;
        });
      }

      // --- JARVIS CHAT TRANSCRIPT SECTION ---
      if (y > 600) {
        doc.addPage();
        y = 40;
      }

      doc.fontSize(13).font('Helvetica-Bold').fillColor(accentViolet).text('Jarvis Conversation Transcript', 40, y);
      y += 20;

      if (chatMessages.length === 0) {
        doc.fontSize(9.5).font('Helvetica-Oblique').fillColor(mutedColor).text('No chat messages were recorded during this session.', 40, y);
      } else {
        chatMessages.forEach((msg) => {
          if (y > 700) {
            doc.addPage();
            y = 40;
          }

          const isUser = msg.role === 'user';
          const header = isUser ? `You (${user.name})` : `${user.jarvisSettings?.name || 'Jarvis'} (AI Assistant)`;
          const headerColor = isUser ? primaryColor : accentViolet;

          doc.fontSize(9).font('Helvetica-Bold').fillColor(headerColor).text(header, 45, y);
          y += 12;
          doc.fontSize(8.5).font('Helvetica').fillColor('#1E293B').text(msg.content, 55, y, { width: 490 });
          y += doc.heightOfString(msg.content, { width: 490 }) + 10;

          if (msg.citations && msg.citations.length > 0) {
            doc.fontSize(7.5).font('Helvetica-Oblique').fillColor(mutedColor).text(
              `Citations: ${msg.citations.map((c) => `${c.documentName} (p.${c.page})`).join(', ')}`,
              55,
              y
            );
            y += 12;
          }
        });
      }

      // --- FOOTER ---
      doc.fontSize(7.5).font('Helvetica').fillColor('#94A3B8').text(
        'Generated by Clause • Privacy-First Intelligent Document Processing • https://clause.ai',
        40,
        780,
        { align: 'center', width: 515 }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateSessionExportPDF,
};
