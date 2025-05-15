/**
 * Enhanced PDF generation utility for MOSimulator
 * Safely generates and displays printable HTML content
 */

import { formatNumber, formatCurrency, formatPercent, safeNumber } from '../formatters';

/**
 * Sanitize a string to prevent XSS attacks in generated HTML
 * Basic implementation - for production, use a library like DOMPurify
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeHTML = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Get color-coded status for the payback period
 * @param {number|string} paybackPeriod - The payback period in months
 * @param {Function} t - Translation function
 * @returns {Object} - Status object with title, backgroundColor and color
 */
const getPaybackStatusInfo = (paybackPeriod, t) => {
  let statusInfo = {
    title: t('excellentInvestment'),
    backgroundColor: '#4caf50', // Success green
    color: '#FFFFFF'
  };

  if (paybackPeriod === '-' || paybackPeriod > 24) {
    statusInfo = {
      title: t('considerCarefully'),
      backgroundColor: '#f44336', // Error red
      color: '#FFFFFF'
    };
  } else if (paybackPeriod > 12) {
    statusInfo = {
      title: t('goodInvestment'),
      backgroundColor: '#ff9800', // Warning orange/yellow
      color: '#FFFFFF'
    };
  }
  
  return statusInfo;
};

/**
 * Generate a printable HTML representation of the simulation results
 * @param {Object} results - The simulation results
 * @param {Function} t - Translation function
 * @returns {String} - HTML content to be printed
 */
export const generatePrintableHTML = (results, t) => {
  // Handle null or invalid results
  if (!results) {
    console.error('Invalid results provided to PDF generator');
    return '<html><body><h1>Error generating PDF</h1></body></html>';
  }
  
  try {
    // Get the current language from the results
    const currentLang = results.language || 'en';
    
    // Initialize inputs safely for PDF generation
    const inputs = results.inputs || {};
    const shortEdge = safeNumber(inputs.shortEdge, 0);
    const longEdge = safeNumber(inputs.longEdge, 0);
    const salesPricePerUnit = safeNumber(inputs.salesPricePerUnit, 0);
    const monthlySalesVolume = safeNumber(inputs.monthlySalesVolume, 0);
    const materialCostPerUnit = safeNumber(inputs.materialCostPerUnit, 0);
    const laborCostPerHour = safeNumber(inputs.laborCostPerHour, 0);
    const inkPricePerCC = safeNumber(inputs.inkPricePerCC, 0);
    
    // Initialize results safely
    const itemsPerPrintJob = safeNumber(results.itemsPerPrintJob, 0);
    const monthlyPrintJobs = safeNumber(results.monthlyPrintJobs, 0);
    const operatingHours = safeNumber(results.operatingHours, 0);
    const inkUsage = results.inkUsage || { white: 0, cmyk: 0, primer: 0 };
    const inkCostPerUnit = safeNumber(results.inkCostPerUnit, 0);
    const costPerUnit = safeNumber(results.costPerUnit, 0);
    const monthlySales = safeNumber(results.monthlySales, 0);
    const monthlyGrossProfit = safeNumber(results.monthlyGrossProfit, 0);
    const grossProfitMargin = safeNumber(results.grossProfitMargin, 0);
    const paybackPeriod = results.paybackPeriod || '-';
    const initialInvestment = safeNumber(results.initialInvestment, 3780000);
    
    // Calculate labor cost - this is an estimate
    const laborCost = costPerUnit - materialCostPerUnit - inkCostPerUnit;
    
    // Sample image as a placeholder path
    const sampleImagePath = '/assets/images/lisa.png';
    
    // Get the status information
    const statusInfo = getPaybackStatusInfo(paybackPeriod, t);
    
    // Format the current date
    const formattedDate = new Date().toLocaleDateString(
      currentLang === 'ja' ? 'ja-JP' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
    
    // Generate HTML content with 2-column layout and matching color scheme
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="${sanitizeHTML(currentLang)}">
      <head>
        <title>${sanitizeHTML(t('mo180Simulator'))} - ${sanitizeHTML(t('simulationResults'))}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
            color: #333;
            background-color: #ffffff;
          }
          h1, h2, h3 {
            color: #008d70;
            margin-top: 0;
          }
          .header {
            border-bottom: 2px solid #008d70;
            padding-bottom: 10px;
            margin-bottom: 20px;
            background-color: #f8f8f8;
            padding: 20px;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .header h2 {
            margin: 5px 0 0 0;
            font-weight: normal;
            font-size: 16px;
            color: #666;
          }
          .status-tag {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 24px;
            font-weight: bold;
            background-color: ${sanitizeHTML(statusInfo.backgroundColor)};
            color: ${sanitizeHTML(statusInfo.color)};
            font-size: 14px;
            float: right;
          }
          .date {
            font-size: 14px;
            color: #777;
            text-align: right;
            margin-bottom: 20px;
          }
          .content-wrapper {
            display: flex;
            flex-direction: row;
            gap: 30px;
          }
          .left-column {
            flex: 0 0 35%;
          }
          .right-column {
            flex: 0 0 60%;
          }
          .card {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            margin-bottom: 24px;
            overflow: hidden;
          }
          .card-header {
            background-color: #f5f5f5;
            padding: 12px 16px;
            border-bottom: 1px solid #e0e0e0;
          }
          .card-header h3 {
            margin: 0;
            font-size: 16px;
          }
          .card-content {
            padding: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0;
          }
          th {
            background-color: #008d70;
            color: white;
            padding: 10px 16px;
            text-align: left;
            font-weight: 500;
            font-size: 14px;
          }
          td {
            padding: 10px 16px;
            border-bottom: 1px solid #eeeeee;
            font-size: 14px;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .value-cell {
            text-align: right;
            font-weight: 500;
          }
          .summary-section {
            background-color: #e8f5e9;
            border-radius: 8px;
            padding: 0;
            margin-bottom: 24px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          }
          .summary-table {
            border: none;
            margin-bottom: 0;
          }
          .summary-table td {
            border-bottom: 1px solid #c8e6c9;
            padding: 14px 16px;
          }
          .summary-table tr:last-child td {
            border-bottom: none;
          }
          .summary-header {
            background-color: #4caf50;
            color: white;
            padding: 12px 16px;
          }
          .summary-header h3 {
            margin: 0;
            color: white;
            font-size: 16px;
          }
          .cyan-accent {
            border-left: 4px solid #00bcd4;
          }
          .magenta-accent {
            border-left: 4px solid #e91e63;
          }
          .yellow-accent {
            border-left: 4px solid #ffc107;
          }
          .blue-accent {
            border-left: 4px solid #2196F3;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          .print-button {
            background-color: #008d70;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s;
            display: block;
            margin: 30px auto;
          }
          .print-button:hover {
            background-color: #00755e;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          .sample-image {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0 auto 10px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
          .sample-caption {
            text-align: center;
            color: #666;
            margin-bottom: 10px;
            font-size: 14px;
          }
          @media print {
            body {
              padding: 0;
              background-color: white;
            }
            .no-print {
              display: none;
            }
            .content-wrapper {
              display: flex;
              flex-direction: row;
            }
            .left-column {
              width: 35%;
            }
            .right-column {
              width: 60%;
            }
            .card {
              box-shadow: none;
              border: 1px solid #e0e0e0;
            }
            .summary-section {
              box-shadow: none;
              border: 1px solid #c8e6c9;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="status-tag">${sanitizeHTML(statusInfo.title)}</span>
          <h1>${sanitizeHTML(t('mo180Simulator'))}</h1>
          <h2>${sanitizeHTML(t('simulationResults'))}</h2>
        </div>
        
        <div class="date">
          ${sanitizeHTML(t('generatedOn'))}: ${sanitizeHTML(formattedDate)}
        </div>
        
        <div class="content-wrapper">
          <!-- Left column - Input parameters -->
          <div class="left-column">
            <!-- Printer Specifications Card with Sample Image -->
            <div class="card blue-accent">
              <div class="card-header">
                <h3>${sanitizeHTML(t('printerSpecifications'))}</h3>
              </div>
              <div class="card-content">
                <img src="${sanitizeHTML(sampleImagePath)}" alt="Sample Print" class="sample-image" />
                <p class="sample-caption">${sanitizeHTML(t('simulationImageCaption') || 'Simulations are based on the above image')}</p>
                
                <table>
                  <tr>
                    <td>${sanitizeHTML(t('initialInvestment'))}</td>
                    <td class="value-cell">${formatCurrency(initialInvestment, currentLang)}</td>
                  </tr>
                </table>
              </div>
            </div>
          
            <div class="card cyan-accent">
              <div class="card-header">
                <h3>${sanitizeHTML(t('simulationParameters'))}</h3>
              </div>
              <div class="card-content">
                <table>
                  <tr>
                    <td>${sanitizeHTML(t('productDimensions'))}</td>
                    <td class="value-cell">${formatNumber(shortEdge)} x ${formatNumber(longEdge)} mm</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('monthlySalesTarget'))}</td>
                    <td class="value-cell">${formatNumber(monthlySalesVolume)} ${sanitizeHTML(t('units'))}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('salesPricePerUnit'))}</td>
                    <td class="value-cell">${formatCurrency(salesPricePerUnit, currentLang)}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('materialCostPerUnit'))}</td>
                    <td class="value-cell">${formatCurrency(materialCostPerUnit, currentLang)}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('laborCostPerHour'))}</td>
                    <td class="value-cell">${formatCurrency(laborCostPerHour, currentLang)}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('inkPrice'))}</td>
                    <td class="value-cell">${formatNumber(inkPricePerCC)} ${sanitizeHTML(t('currency'))}/${sanitizeHTML(t('cc'))}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div class="card magenta-accent">
              <div class="card-header">
                <h3>${sanitizeHTML(t('inkUsagePerItem'))}</h3>
              </div>
              <div class="card-content">
                <table>
                  <tr>
                    <td>${sanitizeHTML(t('white'))}</td>
                    <td class="value-cell">${formatNumber(inkUsage.white, 2)} ${sanitizeHTML(t('cc'))}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('cmyk'))}</td>
                    <td class="value-cell">${formatNumber(inkUsage.cmyk, 2)} ${sanitizeHTML(t('cc'))}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('primer'))}</td>
                    <td class="value-cell">${formatNumber(inkUsage.primer, 2)} ${sanitizeHTML(t('cc'))}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('inkCostPerUnit'))}</td>
                    <td class="value-cell">${formatCurrency(inkCostPerUnit, currentLang, '¥', currentLang === 'ja')}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          
          <!-- Right column - Results -->
          <div class="right-column">
            <div class="summary-section">
              <div class="summary-header">
                <h3>${sanitizeHTML(t('keySummary'))}</h3>
              </div>
              <table class="summary-table">
                <tr>
                  <td><strong>${sanitizeHTML(t('monthlySales'))}</strong></td>
                  <td class="value-cell"><strong>${formatCurrency(monthlySales, currentLang)}</strong></td>
                </tr>
                <tr>
                  <td><strong>${sanitizeHTML(t('monthlyGrossProfit'))}</strong></td>
                  <td class="value-cell"><strong>${formatCurrency(monthlyGrossProfit, currentLang)}</strong></td>
                </tr>
                <tr>
                  <td><strong>${sanitizeHTML(t('grossProfitMargin'))}</strong></td>
                  <td class="value-cell"><strong>${formatPercent(grossProfitMargin)}</strong></td>
                </tr>
                <tr>
                  <td><strong>${sanitizeHTML(t('investmentPaybackPeriod'))}</strong></td>
                  <td class="value-cell"><strong>${paybackPeriod === '-' ? 'N/A' : `${formatNumber(paybackPeriod, 1)} ${sanitizeHTML(t('months'))}`}</strong></td>
                </tr>
              </table>
            </div>
            
            <div class="card yellow-accent">
              <div class="card-header">
                <h3>${sanitizeHTML(t('costBreakdownPerUnit'))}</h3>
              </div>
              <div class="card-content">
                <table>
                  <tr>
                    <td>${sanitizeHTML(t('costPerUnit'))}</td>
                    <td class="value-cell">${formatCurrency(costPerUnit, currentLang)}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('material'))}</td>
                    <td class="value-cell">${formatCurrency(materialCostPerUnit, currentLang)}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('ink'))}</td>
                    <td class="value-cell">${formatCurrency(inkCostPerUnit, currentLang, '¥', currentLang === 'ja')}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('labor'))}</td>
                    <td class="value-cell">${formatCurrency(laborCost, currentLang, '¥', currentLang === 'ja')}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div class="card cyan-accent">
              <div class="card-header">
                <h3>${sanitizeHTML(t('productionDetails'))}</h3>
              </div>
              <div class="card-content">
                <table>
                  <tr>
                    <td>${sanitizeHTML(t('operatingHours'))}</td>
                    <td class="value-cell">${formatNumber(operatingHours, 1)} ${sanitizeHTML(t('hours'))}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('itemsPerPrintJob'))}</td>
                    <td class="value-cell">${formatNumber(itemsPerPrintJob)} ${sanitizeHTML(t('units'))}</td>
                  </tr>
                  <tr>
                    <td>${sanitizeHTML(t('monthlyPrintJobs'))}</td>
                    <td class="value-cell">${formatNumber(monthlyPrintJobs)} ${sanitizeHTML(t('jobs'))}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          Roland DG MO-180 UV Printer | ${sanitizeHTML(t('mo180Simulator'))} | ${sanitizeHTML(formattedDate)}
        </div>
        
        <button class="print-button no-print" onclick="window.print()">
          ${sanitizeHTML(t('downloadPDF'))}
        </button>
      </body>
      </html>
    `;

    return htmlContent;
  } catch (error) {
    console.error('Error generating printable HTML:', error);
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <meta charset="UTF-8">
      </head>
      <body>
        <h1>Error Generating PDF</h1>
        <p>There was an error generating the PDF report. Please try again later.</p>
        <button onclick="window.close()">Close</button>
      </body>
      </html>
    `;
  }
};

/**
 * Open a new window with printable content and improved error handling
 * @param {Object} results - The simulation results
 * @param {Function} t - Translation function
 */
export const printResults = (results, t) => {
  try {
    const html = generatePrintableHTML(results, t);
    
    // Open a new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Popup was blocked or could not be opened');
    }
    
    // Write HTML to the new window
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Log success
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error printing results:', error);
    
    // Show error message to user
    alert(`There was an error generating the PDF: ${error.message}. Please check if popups are allowed for this site.`);
  }
};

export default printResults;
