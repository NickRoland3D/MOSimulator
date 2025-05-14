/**
 * Generate a printable HTML representation of the simulation results
 * @param {Object} results - The simulation results
 * @param {Function} t - Translation function
 * @returns {String} - HTML content to be printed
 */
export const generatePrintableHTML = (results, t) => {
  // Helper function to format numbers with commas as thousands separators
  const formatNumber = (num, decimals = 0) => {
    if (typeof num === 'string') return num;
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount, isEstimate = false) => {
    // Get the current language from the results
    const currentLang = results.language || 'en';
    
    // Place the currency symbol after the number for Japanese
    if (currentLang === 'ja') {
      return isEstimate 
        ? `役${formatNumber(Math.round(amount))}${t('currency')}` 
        : `${formatNumber(Math.round(amount))}${t('currency')}`;
    }
    // Default format for other languages
    return `${t('currency')} ${formatNumber(Math.round(amount))}`;
  };

  // Helper function to format percentage
  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Determine the status tag based on payback period
  let statusInfo = {
    title: t('excellentInvestment'),
    backgroundColor: '#4caf50', // Success green
    color: '#FFFFFF'
  };

  if (results.paybackPeriod > 12) {
    statusInfo = {
      title: t('considerCarefully'),
      backgroundColor: '#f44336', // Error red
      color: '#FFFFFF'
    };
  } else if (results.paybackPeriod > 8) {
    statusInfo = {
      title: t('goodInvestment'),
      backgroundColor: '#ff9800', // Warning orange/yellow
      color: '#FFFFFF'
    };
  }

  // Calculate labor cost - this is an estimate
  const laborCost = (results.costPerUnit || 0) - (results.inputs?.materialCostPerUnit || 0) - (results.inkCostPerUnit || 0);
  
  // Sample image as base64 (lisa.png)
  // NOTE: We're using a placeholder since we can't easily convert the image to base64 here
  // In a real implementation, you'd want to convert the image file to base64 
  // or serve it through a URL in the HTML
  const sampleImageBase64 = '/assets/images/lisa.png';
  
  // Initial investment from the printer configuration
  const initialInvestment = results.initialInvestment || 3780000; // Default from config

  // Generate HTML content with 2-column layout and matching color scheme
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${t('mo180Simulator')} - ${t('simulationResults')}</title>
      <meta charset="UTF-8">
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
          background-color: ${statusInfo.backgroundColor};
          color: ${statusInfo.color};
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
        <span class="status-tag">${statusInfo.title}</span>
        <h1>${t('mo180Simulator')}</h1>
        <h2>${t('simulationResults')}</h2>
      </div>
      
      <div class="date">
        ${t('generatedOn')}: ${new Date().toLocaleDateString()}
      </div>
      
      <div class="content-wrapper">
        <!-- Left column - Input parameters -->
        <div class="left-column">
          <!-- Printer Specifications Card with Sample Image -->
          <div class="card blue-accent">
            <div class="card-header">
              <h3>${t('printerSpecifications')}</h3>
            </div>
            <div class="card-content">
              <img src="${sampleImageBase64}" alt="Sample Print" class="sample-image" />
              <p class="sample-caption">${t('simulationImageCaption') || 'Simulations are based on the above image'}</p>
              
              <table>
                <tr>
                  <td>${t('initialInvestment')}</td>
                  <td class="value-cell">${formatCurrency(initialInvestment)}</td>
                </tr>
                <!-- Removed the Printable Area row as requested -->
              </table>
            </div>
          </div>
        
          <div class="card cyan-accent">
            <div class="card-header">
              <h3>${t('simulationParameters')}</h3>
            </div>
            <div class="card-content">
              <table>
                <tr>
                  <td>${t('productDimensions')}</td>
                  <td class="value-cell">${results.inputs?.shortEdge || 0} x ${results.inputs?.longEdge || 0} mm</td>
                </tr>
                <tr>
                  <td>${t('monthlySalesTarget')}</td>
                  <td class="value-cell">${formatNumber(results.inputs?.monthlySalesVolume || 0)} ${t('units')}</td>
                </tr>
                <tr>
                  <td>${t('salesPricePerUnit')}</td>
                  <td class="value-cell">${formatCurrency(results.inputs?.salesPricePerUnit || 0)}</td>
                </tr>
                <tr>
                  <td>${t('materialCostPerUnit')}</td>
                  <td class="value-cell">${formatCurrency(results.inputs?.materialCostPerUnit || 0)}</td>
                </tr>
                <tr>
                  <td>${t('laborCostPerHour')}</td>
                  <td class="value-cell">${formatCurrency(results.inputs?.laborCostPerHour || 0)}</td>
                </tr>
                <tr>
                  <td>${t('inkPrice')}</td>
                  <td class="value-cell">${results.inputs?.inkPricePerCC || 0} ${t('currency')}/${t('cc')}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <div class="card magenta-accent">
            <div class="card-header">
              <h3>${t('inkUsagePerItem')}</h3>
            </div>
            <div class="card-content">
              <table>
                <tr>
                  <td>${t('white')}</td>
                  <td class="value-cell">${results.inkUsage.white} ${t('cc')}</td>
                </tr>
                <tr>
                  <td>${t('cmyk')}</td>
                  <td class="value-cell">${results.inkUsage.cmyk} ${t('cc')}</td>
                </tr>
                <tr>
                  <td>${t('primer')}</td>
                  <td class="value-cell">${results.inkUsage.primer} ${t('cc')}</td>
                </tr>
                <tr>
                  <td>${t('inkCostPerUnit')}</td>
                  <td class="value-cell">${results.language === 'ja' ? formatCurrency(results.inkCostPerUnit, true) : formatCurrency(results.inkCostPerUnit)}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Right column - Results -->
        <div class="right-column">
          <div class="summary-section">
            <div class="summary-header">
              <h3>${t('keySummary')}</h3>
            </div>
            <table class="summary-table">
              <tr>
                <td><strong>${t('monthlySales')}</strong></td>
                <td class="value-cell"><strong>${formatCurrency(results.monthlySales)}</strong></td>
              </tr>
              <tr>
                <td><strong>${t('monthlyGrossProfit')}</strong></td>
                <td class="value-cell"><strong>${formatCurrency(results.monthlyGrossProfit)}</strong></td>
              </tr>
              <tr>
                <td><strong>${t('grossProfitMargin')}</strong></td>
                <td class="value-cell"><strong>${formatPercent(results.grossProfitMargin)}</strong></td>
              </tr>
              <tr>
                <td><strong>${t('investmentPaybackPeriod')}</strong></td>
                <td class="value-cell"><strong>${results.paybackPeriod === '-' ? 'N/A' : `${results.paybackPeriod.toFixed(1)} ${t('months')}`}</strong></td>
              </tr>
            </table>
          </div>
          
          <div class="card yellow-accent">
            <div class="card-header">
              <h3>${t('costBreakdownPerUnit')}</h3>
            </div>
            <div class="card-content">
              <table>
                <tr>
                  <td>${t('costPerUnit')}</td>
                  <td class="value-cell">${formatCurrency(results.costPerUnit)}</td>
                </tr>
                <tr>
                  <td>${t('material')}</td>
                  <td class="value-cell">${formatCurrency(results.inputs?.materialCostPerUnit || 0)}</td>
                </tr>
                <tr>
                  <td>${t('ink')}</td>
                  <td class="value-cell">${results.language === 'ja' ? formatCurrency(results.inkCostPerUnit, true) : formatCurrency(results.inkCostPerUnit)}</td>
                </tr>
                <tr>
                  <td>${t('labor')}</td>
                  <td class="value-cell">${results.language === 'ja' ? formatCurrency(laborCost, true) : formatCurrency(laborCost)}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <div class="card cyan-accent">
            <div class="card-header">
              <h3>${t('productionDetails')}</h3>
            </div>
            <div class="card-content">
              <table>
                <tr>
                  <td>${t('operatingHours')}</td>
                  <td class="value-cell">${results.operatingHours.toFixed(1)} ${t('hours')}</td>
                </tr>
                <tr>
                  <td>${t('itemsPerPrintJob')}</td>
                  <td class="value-cell">${formatNumber(results.itemsPerPrintJob)} ${t('units')}</td>
                </tr>
                <tr>
                  <td>${t('monthlyPrintJobs')}</td>
                  <td class="value-cell">${formatNumber(results.monthlyPrintJobs)} ${t('jobs')}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        Roland DG MO-180 UV Printer | ${t('mo180Simulator')} | ${new Date().toLocaleDateString()}
      </div>
      
      <button class="print-button no-print" onclick="window.print()">
        ${t('downloadPDF')}
      </button>
    </body>
    </html>
  `;

  return htmlContent;
};

/**
 * Open a new window with printable content
 * @param {Object} results - The simulation results
 * @param {Function} t - Translation function
 */
export const printResults = (results, t) => {
  const html = generatePrintableHTML(results, t);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  // The user can click the print button in the new window
};

export default printResults;
