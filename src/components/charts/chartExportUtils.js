import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDealerCardMoney, getEffectiveCurrencyCode } from '@/lib/dashboardMoney';

/**
 * Export chart data to Excel file
 * @param {Array} data - Array of data objects
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the Excel sheet
 */
export const exportToExcel = (
  data,
  filename = 'chart-data',
  sheetName = 'Data',
  isAdmin = false,
  currencyCode = 'JPY'
) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data to export');
    return false;
  }

  try {
    const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
    const mk = (label) => `${label} (${code})`;
    // Transform data for better readability
    const formattedData = data.map((item) => ({
      Period: item.label || item.period,
      [mk('Actual Cost')]: item.actual_cost || 0,
      [mk('Support Cost')]: item.support_cost || 0,
      [mk('Total Cost')]: item.total_cost || 0,
      [mk('Incentive')]: item.incentive || 0,
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // Period
      { wch: 15 }, // Actual Cost
      { wch: 15 }, // Support Cost
      { wch: 15 }, // Total Cost
      { wch: 15 }, // Incentive
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate and download the file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Export chart data with totals to Excel file
 * @param {Array} series - Series data array
 * @param {Object} totals - Totals object
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToExcelWithTotals = (
  series,
  totals,
  filename = 'chart-data',
  isAdmin = false,
  currencyCode = 'JPY'
) => {
  if (!series || !Array.isArray(series) || series.length === 0) {
    console.warn('No data to export');
    return false;
  }

  try {
    const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
    const mk = (label) => `${label} (${code})`;
    // Transform series data
    const formattedData = series.map((item) => ({
      Period: item.label || item.period,
      [mk('Actual Cost')]: item.actual_cost || 0,
      [mk('Support Cost')]: item.support_cost || 0,
      [mk('Total Cost')]: item.total_cost || 0,
      [mk('Incentive')]: item.incentive || 0,
    }));

    // Add totals row
    if (totals) {
      formattedData.push({
        Period: 'TOTAL',
        [mk('Actual Cost')]: totals.actual_cost || 0,
        [mk('Support Cost')]: totals.support_cost || 0,
        [mk('Total Cost')]: totals.total_cost || 0,
        [mk('Incentive')]: totals.incentive || 0,
      });
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Marketing Data');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Export report table data (months with rows) to Excel
 * @param {{ months: Array<{ period: string, label: string, rows: Array }>, term?: { name: string } }} reportData
 * @param {string} filename - Name of the file (without extension)
 */
export const exportReportToExcel = (reportData, filename = 'report') => {
  if (!reportData?.months || !Array.isArray(reportData.months) || reportData.months.length === 0) {
    console.warn('No report data to export');
    return false;
  }

  try {
    const formatNum = (value) =>
      new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(
        Number(value) || 0
      );
    // Build an array-of-arrays so we can attach hyperlinks to specific cells
    const header = ['Month', 'Company', 'Plan', 'Activity', 'Actual Cost', 'Support Cost', 'Evidences'];
    const aoa = [header];
    const metaRows = []; // keep mapping to original rows so we can construct urls

    for (const monthGroup of reportData.months) {
      for (const row of monthGroup.rows || []) {
        const evidCount = row.evidences?.length ?? 0;
        const rowIndex = aoa.length; // 0-based row index for this new row in aoa
        aoa.push([
          monthGroup.label || monthGroup.period || '',
          row.company_name || '',
          row.plan_name || '',
          row.activity_name || '',
          formatNum(row.actual_cost),
          formatNum(row.support_cost),
          String(evidCount),
        ]);

        // store metadata for hyperlink creation (only if there is at least one evidence)
        if (evidCount && evidCount > 0) {
          metaRows.push({ rowIndex, activity_id: row.activity_id, plan_id: row.plan_id });
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 14 }, // Month
      { wch: 22 }, // Company
      { wch: 22 }, // Plan
      { wch: 28 }, // Activity
      { wch: 14 }, // Actual Cost
      { wch: 14 }, // Support Cost
      { wch: 12 }, // Evidences
    ];

    // Add hyperlinks for evidences cells that have evidence
    // Link will navigate to marketing-plans and include activity & plan ids and an openDrawer flag
    const termId = reportData?.term?.id;
    for (const meta of metaRows) {
      try {
        const { rowIndex, activity_id, plan_id } = meta;
        const params = new URLSearchParams();
        if (activity_id) params.set('activity', String(activity_id));
        if (plan_id) params.set('plan', String(plan_id));
        if (termId) params.set('term', String(termId));
        params.set('openDrawer', '1');

        const url = `https://marketing.5v.ae/marketing-plans?${params.toString()}`;

        // evidences is the 7th column -> column index 6 (0-based)
        const cellAddress = XLSX.utils.encode_cell({ c: 6, r: rowIndex });
        // Ensure cell exists
        worksheet[cellAddress] = worksheet[cellAddress] || { t: 's', v: '1' };
        // Set hyperlink
        worksheet[cellAddress].l = { Target: url, Tooltip: 'Open evidences in Marketing Plans' };
        worksheet[cellAddress].t = 's';
        worksheet[cellAddress].v = worksheet[cellAddress].v ?? '';
      } catch (err) {
        // ignore individual cell hyperlink errors
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting report to Excel:', error);
    return false;
  }
};

/**
 * Export a DOM element (chart) to PDF
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} filename - Name of the file (without extension)
 * @param {string} title - Title to display in the PDF
 */
export const exportToPDF = async (element, filename = 'chart', title = 'Chart Report') => {
  if (!element) {
    console.warn('No element to export');
    return false;
  }

  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Create PDF with appropriate dimensions
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [imgWidth + 40, imgHeight + 80],
    });

    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 40);
    pdf.text(title, 20, 35);

    // Add date
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);

    // Add the chart image
    pdf.addImage(imgData, 'PNG', 20, 70, imgWidth, imgHeight);

    // Save the PDF
    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};

/**
 * Export chart and data table to PDF
 * @param {HTMLElement} chartElement - The chart DOM element
 * @param {Array} data - Data array for the table
 * @param {Object} totals - Totals object
 * @param {string} filename - Name of the file
 * @param {string} title - Report title
 */
export const exportChartWithDataToPDF = async (
  chartElement,
  data,
  totals,
  filename = 'chart-report',
  title = 'Marketing Report',
  isAdmin = false,
  currencyCode = 'JPY'
) => {
  if (!chartElement) {
    console.warn('No chart element to export');
    return false;
  }

  try {
    // Capture the chart as canvas
    const canvas = await html2canvas(chartElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF in A4 landscape
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add title
    pdf.setFontSize(18);
    pdf.setTextColor(40, 40, 40);
    pdf.text(title, 14, 20);

    // Add date
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    // Add chart image (scaled to fit)
    const chartWidth = pageWidth - 28;
    const chartHeight = (canvas.height / canvas.width) * chartWidth;
    const maxChartHeight = pageHeight - 80;
    const finalChartHeight = Math.min(chartHeight, maxChartHeight);
    const finalChartWidth = (finalChartHeight / chartHeight) * chartWidth;

    pdf.addImage(imgData, 'PNG', 14, 35, finalChartWidth, finalChartHeight);

    // Add data table on new page if we have data
    if (data && data.length > 0) {
      pdf.addPage();
      
      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Data Summary', 14, 20);

      const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
      // Table headers
      const headers = [
        'Period',
        `Actual (${code})`,
        `Support (${code})`,
        `Total (${code})`,
        `Incentive (${code})`,
      ];
      const colWidths = [50, 40, 40, 40, 40];
      let startY = 30;

      // Draw header
      pdf.setFillColor(230, 0, 18); // #E60012
      pdf.rect(14, startY, colWidths.reduce((a, b) => a + b, 0), 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      
      let x = 14;
      headers.forEach((header, i) => {
        pdf.text(header, x + 2, startY + 7);
        x += colWidths[i];
      });

      // Draw rows
      startY += 10;
      pdf.setTextColor(40, 40, 40);

      const formatCurrency = (val) => formatDealerCardMoney(val, isAdmin, currencyCode);

      data.forEach((row, index) => {
        if (startY > pageHeight - 20) {
          pdf.addPage();
          startY = 20;
        }

        // Alternate row colors
        if (index % 2 === 0) {
          pdf.setFillColor(245, 245, 245);
          pdf.rect(14, startY, colWidths.reduce((a, b) => a + b, 0), 8, 'F');
        }

        x = 14;
        const rowData = [
          row.label || row.period,
          formatCurrency(row.actual_cost),
          formatCurrency(row.support_cost),
          formatCurrency(row.total_cost),
          formatCurrency(row.incentive),
        ];

        rowData.forEach((cell, i) => {
          pdf.text(String(cell), x + 2, startY + 6);
          x += colWidths[i];
        });

        startY += 8;
      });

      // Add totals row
      if (totals) {
        pdf.setFillColor(230, 0, 18);
        pdf.rect(14, startY, colWidths.reduce((a, b) => a + b, 0), 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);

        x = 14;
        const totalsRow = [
          'TOTAL',
          formatCurrency(totals.actual_cost),
          formatCurrency(totals.support_cost),
          formatCurrency(totals.total_cost),
          formatCurrency(totals.incentive),
        ];

        totalsRow.forEach((cell, i) => {
          pdf.text(String(cell), x + 2, startY + 7);
          x += colWidths[i];
        });
      }
    }

    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
};

/**
 * Export two-years comparison data to Excel (one sheet per year)
 * @param {{ years: Array<{ year: number, months: Array<{ period: string, label: string, support_cost_jpy: number }>, total_support_cost_jpy: number }> }} twoYearsData
 * @param {string} filename - Name of the file (without extension)
 */
export const exportTwoYearsToExcel = (
  twoYearsData,
  filename = 'two-years-support-cost',
  isAdmin = false,
  currencyCode = 'JPY'
) => {
  if (!twoYearsData?.years || !Array.isArray(twoYearsData.years) || twoYearsData.years.length === 0) {
    console.warn('No two-years data to export');
    return false;
  }

  try {
    const code = getEffectiveCurrencyCode(isAdmin, currencyCode);
    const supportCol = `Support Cost (${code})`;
    const workbook = XLSX.utils.book_new();

    twoYearsData.years.forEach((yearBlock) => {
      const rows = (yearBlock.months || []).map((m) => ({
        Period: m.period || '',
        Label: m.label || '',
        [supportCol]: Number(m.support_cost_jpy) || 0,
      }));
      if (yearBlock.total_support_cost_jpy != null) {
        rows.push({
          Period: '',
          Label: 'TOTAL',
          [supportCol]: Number(yearBlock.total_support_cost_jpy) || 0,
        });
      }
      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet['!cols'] = [{ wch: 12 }, { wch: 14 }, { wch: 18 }];
      const sheetName = `Year ${yearBlock.year}`.slice(0, 31);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting two-years to Excel:', error);
    return false;
  }
};

/**
 * Export chart as PNG image
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToPNG = async (element, filename = 'chart') => {
  if (!element) {
    console.warn('No element to export');
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    return false;
  }
};
