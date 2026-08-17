import { Document, Packer, Paragraph, TextRun, ImageRun, SectionType, AlignmentType, HeadingLevel, ShadingType, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { processReportData } from './reportGeneratorUtils';

// Helper to load logo
async function getLogoBuffer() {
  try {
    const response = await fetch('/logo.png');
    if (!response.ok) throw new Error('Network response was not ok');
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    console.warn('Could not load logo.png, proceeding without logo', error);
    return null;
  }
}

// Clean table borders
const cleanTableBorders = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
  bottom: { style: BorderStyle.SINGLE, size: 6, color: "CBD5E1" },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "F1F5F9" },
  insideVertical: { style: BorderStyle.NONE }
};

export async function generateReport({ clients, fromDate, toDate, reportTitle, DEFAULT_TASKS, isSingleClient }) {
  const reportData = processReportData(clients, fromDate, toDate, DEFAULT_TASKS);
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'full', timeStyle: 'short' });

  const dateRangeText = fromDate && toDate
    ? `${new Date(fromDate + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })} — ${new Date(toDate + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })}`
    : fromDate
      ? `From ${new Date(fromDate + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })}`
      : toDate
        ? `Up to ${new Date(toDate + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })}`
        : 'All Time';

  const logoBuffer = await getLogoBuffer();

  const headerParagraphs = [];

  // Add Logo if available - Width: 150, Height: 40 (Aspect Ratio: 3.75 matches 1127x301)
  if (logoBuffer) {
    headerParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new ImageRun({
            data: logoBuffer,
            transformation: { width: 150, height: 40 },
            type: 'png'
          })
        ]
      })
    );
  }

  // Cover Section
  headerParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 },
      children: [
        new TextRun({ text: (reportTitle || 'CLIENT OPERATIONS REPORT').toUpperCase(), bold: true, size: 38, color: 'DC2626' })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({ text: dateRangeText, size: 24, color: '64748B' }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      borders: {
        bottom: { color: "DC2626", space: 1, value: "single", size: 6 },
      },
      children: [
        new TextRun({ text: `Generated: ${now}`, size: 18, color: '94A3B8' }),
      ]
    })
  );

  let children = [...headerParagraphs];

  if (!isSingleClient) {
    // Executive Summary format
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({ text: 'Executive Summary', bold: true, size: 28, color: 'DC2626' })
        ]
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [
          new TextRun({ text: `This report provides a comprehensive overview of client onboarding progress and team performance for the period: ${dateRangeText}.`, size: 22, color: '334155' })
        ]
      })
    );

    // Create a beautiful Executive Summary Grid Table
    const summaryTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cleanTableBorders,
      rows: [
        new TableRow({
          children: [
            createHeaderCell('Key Performance Metric', 60),
            createHeaderCell('Current Status / Value', 40)
          ]
        }),
        createSummaryRow('Total Active Clients', `${reportData.totalClients} Clients`),
        createSummaryRow('Average Operations Progress', `${reportData.avgProgress}%`),
        createSummaryRow('Completed Milestone Tasks', `${reportData.totalCompleted} Tasks`),
        createSummaryRow('Outstanding / Pending Tasks', `${reportData.totalPending} Tasks`)
      ]
    });

    children.push(summaryTable);
    children.push(new Paragraph({ text: '', spacing: { after: 300 } }));
    children.push(new Paragraph({ text: '', pageBreakBefore: true })); // Page break before client breakdown
    
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({ text: 'Client Breakdown', bold: true, size: 28, color: 'DC2626' })
        ]
      })
    );
  }

  // Per Client Data
  reportData.reportClients.forEach((client, idx) => {
    children.push(
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({ text: ` ${isSingleClient ? client.name : `${idx + 1}. ${client.name}`}`, bold: true, size: 30, color: 'DC2626' })
        ]
      })
    );

    // Client overview stats table
    const clientOverviewTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cleanTableBorders,
      rows: [
        new TableRow({
          children: [
            createHeaderCell('Package', 25),
            createHeaderCell('Start Date', 25),
            createHeaderCell('Tasks (Done/Total)', 25),
            createHeaderCell('Overall Progress', 25)
          ]
        }),
        new TableRow({
          children: [
            createCell(client.package?.toUpperCase() || 'N/A', false, '334155'),
            createCell(client.startDate || 'N/A', false, '334155'),
            createCell(`${client.completedCount} / ${client.totalTasks}`, false, '334155'),
            createCell(`${client.progress}%`, true, 'DC2626')
          ]
        })
      ]
    });

    children.push(clientOverviewTable);
    children.push(new Paragraph({ text: '', spacing: { after: 150 } }));

    // Progress Bar representation
    const filled = Math.round(client.progress / 5);
    const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: `Progress: ${bar}  ${client.progress}%`, bold: true, size: 20, color: 'DC2626' })
        ]
      })
    );

    // Group client tasks chronologically by Day and Phase
    const clientDefs = client.completedTasks.concat(client.pendingTasks);
    
    const sprintTasks = clientDefs
      .filter(t => t.phase === 'sprint' || t.day <= 7)
      .map(t => ({
        ...t,
        done: client.completedTasks.some(ct => ct.id === t.id),
        notes: client.tasksWithNotes.find(n => n.id === t.id)?.noteText || ''
      }))
      .sort((a, b) => a.day - b.day);

    const ongoingTasks = clientDefs
      .filter(t => t.phase === 'ongoing' || t.day > 7)
      .map(t => ({
        ...t,
        done: client.completedTasks.some(ct => ct.id === t.id),
        notes: client.tasksWithNotes.find(n => n.id === t.id)?.noteText || ''
      }))
      .sort((a, b) => a.day - b.day);

    // 1. Sprint Phase Day-wise Table
    if (sprintTasks.length > 0) {
      children.push(...createPhaseTable('Sprint Phase (Days 1 — 7): Onboarding & Setup', sprintTasks));
    }

    // 2. Ongoing Phase Day-wise Table
    if (ongoingTasks.length > 0) {
      children.push(...createPhaseTable('Ongoing Phase (Days 8 — 90): Execution & Outreach', ongoingTasks));
    }

    if (idx < reportData.reportClients.length - 1) {
      children.push(new Paragraph({
        spacing: { before: 200, after: 200 },
        borders: { bottom: { color: "E2E8F0", space: 1, value: "single", size: 6 } }
      }));
    }
  });

  // Footer / Report Notes Page
  children.push(
    new Paragraph({ text: '', pageBreakBefore: true }),
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({ text: 'Report Notes & Disclaimer', bold: true, size: 28, color: 'DC2626' })
      ]
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({ text: 'This report was automatically generated by Spread Pixel Ops Dashboard. All data is sourced directly from the live operations database. Task completion status and audit trails reflect the most recent update at the time of report generation.', size: 20, color: '64748B' })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 100 },
      children: [
        new TextRun({ text: 'Confidential — For Internal Use Only', bold: true, size: 20, color: 'EA580C' })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '© Spread Pixel — All Rights Reserved', size: 18, color: '94A3B8' })
      ]
    })
  );

  const doc = new Document({
    sections: [{
      properties: { type: SectionType.CONTINUOUS },
      children
    }]
  });

  const blob = await Packer.toBlob(doc);
  const clientNameStr = isSingleClient ? `_${clients[0].name.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
  const dateRangeLabel = fromDate && toDate
    ? `${fromDate}_to_${toDate}`
    : fromDate ? `from_${fromDate}` : toDate ? `to_${toDate}` : 'AllTime';

  saveAs(blob, `Report${clientNameStr}_${dateRangeLabel}.docx`);
  return reportData;
}

// Phase table generation helper
function createPhaseTable(phaseTitle, tasks) {
  const rows = [
    new TableRow({
      children: [
        createHeaderCell('Day', 12),
        createHeaderCell('Task Name', 38),
        createHeaderCell('Role', 15),
        createHeaderCell('Status', 15),
        createHeaderCell('Evidence / Remarks', 20)
      ]
    })
  ];

  tasks.forEach((t, tIdx) => {
    // If pending and we have way too many, limit pending list to keep report clean
    if (!t.done && tIdx > 30 && !t.notes) {
      return;
    }

    const statusText = t.done ? 'Completed' : 'Pending';
    const statusColor = t.done ? '16A34A' : '64748B';
    // Soft green for completed row, clean alternating white/gray for pending
    const rowBg = t.done ? 'ECFDF5' : (tIdx % 2 === 1 ? 'F8FAFC' : 'FFFFFF');

    let displayName = t.n;
    if (t.day >= 8) {
      const postNum = Math.floor((t.day - 8) / 2) + 1;
      const postType = (t.day % 4 === 0) ? "Graphic Post" : "Video Post";
      displayName = `${t.n} (Post #${postNum} - ${postType})`;
    }

    rows.push(
      new TableRow({
        children: [
          createCell(`Day ${t.day}`, true, '1E293B', rowBg),
          createCell(displayName + (t.freq && t.day < 8 ? ` (${t.freq})` : ''), false, '1E293B', rowBg),
          createCell(t.role?.toUpperCase() || 'N/A', false, '475569', rowBg),
          createCell(statusText, true, statusColor, rowBg),
          createCell(t.notes || '—', t.notes ? true : false, t.notes ? '475569' : '94A3B8', rowBg, true)
        ]
      })
    );
  });

  return [
    createSectionLabel(phaseTitle),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cleanTableBorders,
      rows
    }),
    new Paragraph({ text: '', spacing: { after: 150 } })
  ];
}

// DOCX Table Cell Builders
function createHeaderCell(text, widthPercent) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { fill: "DC2626" },
    margins: { top: 140, bottom: 140, left: 160, right: 160 },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({ text, bold: true, color: "FFFFFF", size: 20 })
        ]
      })
    ]
  });
}

function createCell(text, bold = false, color = '334155', bg = 'FFFFFF', italic = false) {
  return new TableCell({
    shading: bg !== 'FFFFFF' ? { fill: bg } : undefined,
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({ text, bold, color, italic, size: 19 })
        ]
      })
    ]
  });
}

function createSummaryRow(metric, value) {
  return new TableRow({
    children: [
      createCell(metric, true, '1E293B'),
      createCell(value, true, 'DC2626')
    ]
  });
}

function createSectionLabel(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({ text, bold: true, size: 22, color: '1E293B' })
    ]
  });
}
