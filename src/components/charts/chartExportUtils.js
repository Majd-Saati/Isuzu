import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export chart data to Excel file
 * @param {Array} data - Array of data objects
 * @param {string} filename - Name of the file (without extension)
 * @param {string} sheetName - Name of the Excel sheet
 */
export const exportToExcel = (data, filename = 'chart-data', sheetName = 'Data') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data to export');
    return false;
  }

  try {
    // Transform data for better readability
    const formattedData = data.map((item) => ({
      Period: item.label || item.period,
      'Actual Cost ($)': item.actual_cost || 0,
      'Support Cost ($)': item.support_cost || 0,
      'Total Cost ($)': item.total_cost || 0,
      'Incentive ($)': item.incentive || 0,
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
export const exportToExcelWithTotals = (series, totals, filename = 'chart-data') => {
  if (!series || !Array.isArray(series) || series.length === 0) {
    console.warn('No data to export');
    return false;
  }

  try {
    // Transform series data
    const formattedData = series.map((item) => ({
      Period: item.label || item.period,
      'Actual Cost ($)': item.actual_cost || 0,
      'Support Cost ($)': item.support_cost || 0,
      'Total Cost ($)': item.total_cost || 0,
      'Incentive ($)': item.incentive || 0,
    }));

    // Add totals row
    if (totals) {
      formattedData.push({
        Period: 'TOTAL',
        'Actual Cost ($)': totals.actual_cost || 0,
        'Support Cost ($)': totals.support_cost || 0,
        'Total Cost ($)': totals.total_cost || 0,
        'Incentive ($)': totals.incentive || 0,
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
  title = 'Marketing Report'
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

      // Table headers
      const headers = ['Period', 'Actual Cost', 'Support Cost', 'Total Cost', 'Incentive'];
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

      const formatCurrency = (val) => `$${Number(val || 0).toLocaleString()}`;

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
