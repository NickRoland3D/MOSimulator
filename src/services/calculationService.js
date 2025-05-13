/**
 * MO-180 Sales Simulator Calculation Service
 * 
 * This module contains all the core calculation functions for the MO-180 Sales Simulation Tool.
 * Moved from utils to services as part of refactoring.
 */

import { PRINTER_SPECIFICATIONS, UI_CONSTANTS } from '../config/constants';

// Get printer constants from configuration
const { initialInvestment: INITIAL_INVESTMENT, printSpeed: PRINT_SPEED, printableArea: PRINTABLE_AREA } = PRINTER_SPECIFICATIONS;
const { paybackThresholds } = UI_CONSTANTS;

/**
 * Calculate the maximum number of items that can fit in a print job
 * Considers both orientations of the item and returns the maximum
 * 
 * @param {number} shortEdge - Short edge dimension in mm
 * @param {number} longEdge - Long edge dimension in mm
 * @returns {number} Maximum number of items per print job
 */
export const calculateItemsPerPrintJob = (shortEdge, longEdge) => {
  // Validate inputs
  if (shortEdge <= 0 || longEdge <= 0) {
    return 0;
  }
  
  // Handle case where dimensions exceed printable area
  if (shortEdge > PRINTABLE_AREA.width && shortEdge > PRINTABLE_AREA.height) {
    return 0;
  }
  if (longEdge > PRINTABLE_AREA.width && longEdge > PRINTABLE_AREA.height) {
    return 0;
  }
  
  // Calculate items in first orientation (short edge along width, long edge along height)
  const orientation1 = Math.floor(PRINTABLE_AREA.width / shortEdge) * 
                      Math.floor(PRINTABLE_AREA.height / longEdge);
  
  // Calculate items in second orientation (short edge along height, long edge along width)
  const orientation2 = Math.floor(PRINTABLE_AREA.width / longEdge) * 
                      Math.floor(PRINTABLE_AREA.height / shortEdge);
  
  // Return the maximum of the two orientations
  return Math.max(orientation1, orientation2);
};

/**
 * Calculate the monthly number of print jobs required
 * 
 * @param {number} monthlySalesVolume - Monthly sales volume in units
 * @param {number} itemsPerPrintJob - Number of items per print job
 * @returns {number} Number of monthly print jobs (rounded up)
 */
export const calculateMonthlyPrintJobs = (monthlySalesVolume, itemsPerPrintJob) => {
  // Handle division by zero
  if (itemsPerPrintJob <= 0) {
    return 0;
  }
  
  // Ceil to ensure enough jobs are run
  return Math.ceil(monthlySalesVolume / itemsPerPrintJob);
};

/**
 * Calculate monthly operating hours
 * 
 * @param {number} monthlyPrintJobs - Number of monthly print jobs
 * @returns {number} Operating hours per month
 */
export const calculateOperatingHours = (monthlyPrintJobs) => {
  return monthlyPrintJobs / PRINT_SPEED;
};

/**
 * Calculate ink usage per item using the scaling formula
 * 
 * @param {number} shortEdge - Short edge dimension in mm
 * @returns {Object} Ink usage in cc for White, CMYK, and Primer
 */
export const calculateInkUsage = (shortEdge) => {
  // Calculate scaling factor based on reference point
  const scale = Math.pow(shortEdge / 65, 2);
  
  // Calculate ink usage based on scaling factor
  return {
    white: 0.04 * scale,
    cmyk: 0.04 * scale,
    primer: 0.01 * scale
  };
};

/**
 * Calculate ink cost per unit
 * 
 * @param {Object} inkUsage - Ink usage in cc {white, cmyk, primer}
 * @param {number} inkPricePerCC - Ink price per cc in JPY
 * @returns {number} Ink cost per unit in JPY
 */
export const calculateInkCostPerUnit = (inkUsage, inkPricePerCC) => {
  const totalInkUsage = inkUsage.white + inkUsage.cmyk + inkUsage.primer;
  return totalInkUsage * inkPricePerCC;
};

/**
 * Calculate labor cost per unit
 * 
 * @param {number} laborCostPerHour - Labor cost per hour in JPY
 * @param {number} itemsPerPrintJob - Number of items per print job
 * @returns {number} Labor cost per unit in JPY
 */
export const calculateLaborCostPerUnit = (laborCostPerHour, itemsPerPrintJob) => {
  // Handle division by zero
  if (itemsPerPrintJob <= 0) {
    return 0;
  }
  
  return (laborCostPerHour / PRINT_SPEED) / itemsPerPrintJob;
};

/**
 * Calculate total cost per unit
 * 
 * @param {number} materialCostPerUnit - Material cost per unit in JPY
 * @param {number} inkCostPerUnit - Ink cost per unit in JPY
 * @param {number} laborCostPerUnit - Labor cost per unit in JPY
 * @returns {number} Total cost per unit in JPY
 */
export const calculateCostPerUnit = (materialCostPerUnit, inkCostPerUnit, laborCostPerUnit) => {
  return materialCostPerUnit + inkCostPerUnit + laborCostPerUnit;
};

/**
 * Calculate monthly sales
 * 
 * @param {number} salesPricePerUnit - Sales price per unit in JPY
 * @param {number} monthlySalesVolume - Monthly sales volume in units
 * @returns {number} Monthly sales in JPY
 */
export const calculateMonthlySales = (salesPricePerUnit, monthlySalesVolume) => {
  return salesPricePerUnit * monthlySalesVolume;
};

/**
 * Calculate monthly gross profit
 * 
 * @param {number} salesPricePerUnit - Sales price per unit in JPY
 * @param {number} costPerUnit - Total cost per unit in JPY
 * @param {number} monthlySalesVolume - Monthly sales volume in units
 * @returns {number} Monthly gross profit in JPY
 */
export const calculateMonthlyGrossProfit = (salesPricePerUnit, costPerUnit, monthlySalesVolume) => {
  return (salesPricePerUnit - costPerUnit) * monthlySalesVolume;
};

/**
 * Calculate gross profit margin as a percentage
 * 
 * @param {number} salesPricePerUnit - Sales price per unit in JPY
 * @param {number} costPerUnit - Total cost per unit in JPY
 * @returns {number} Gross profit margin as a percentage
 */
export const calculateGrossProfitMargin = (salesPricePerUnit, costPerUnit) => {
  // Handle division by zero
  if (salesPricePerUnit <= 0) {
    return 0;
  }
  
  return ((salesPricePerUnit - costPerUnit) / salesPricePerUnit) * 100;
};

/**
 * Calculate investment payback period in months
 * 
 * @param {number} monthlyGrossProfit - Monthly gross profit in JPY
 * @returns {number|string} Payback period in months or '-' if no profit
 */
export const calculatePaybackPeriod = (monthlyGrossProfit) => {
  // Handle no profit case
  if (monthlyGrossProfit <= 0) {
    return '-';
  }
  
  return INITIAL_INVESTMENT / monthlyGrossProfit;
};

/**
 * Perform all calculations and return complete results
 * 
 * @param {Object} inputs - All user inputs
 * @returns {Object} Complete calculation results
 */
export const calculateResults = (inputs) => {
  const {
    shortEdge,
    longEdge,
    salesPricePerUnit,
    monthlySalesVolume,
    materialCostPerUnit,
    laborCostPerHour,
    inkPricePerCC
  } = inputs;
  
  // Calculate intermediate values
  const itemsPerPrintJob = calculateItemsPerPrintJob(shortEdge, longEdge);
  const monthlyPrintJobs = calculateMonthlyPrintJobs(monthlySalesVolume, itemsPerPrintJob);
  const operatingHours = calculateOperatingHours(monthlyPrintJobs);
  const inkUsage = calculateInkUsage(shortEdge);
  const inkCostPerUnit = calculateInkCostPerUnit(inkUsage, inkPricePerCC);
  const laborCostPerUnit = calculateLaborCostPerUnit(laborCostPerHour, itemsPerPrintJob);
  
  // Calculate final results
  const costPerUnit = calculateCostPerUnit(materialCostPerUnit, inkCostPerUnit, laborCostPerUnit);
  const monthlySales = calculateMonthlySales(salesPricePerUnit, monthlySalesVolume);
  const monthlyGrossProfit = calculateMonthlyGrossProfit(salesPricePerUnit, costPerUnit, monthlySalesVolume);
  const grossProfitMargin = calculateGrossProfitMargin(salesPricePerUnit, costPerUnit);
  const paybackPeriod = calculatePaybackPeriod(monthlyGrossProfit);
  
  // Format ink usage to 2 decimal places
  const formattedInkUsage = {
    white: parseFloat(inkUsage.white.toFixed(2)),
    cmyk: parseFloat(inkUsage.cmyk.toFixed(2)),
    primer: parseFloat(inkUsage.primer.toFixed(2))
  };
  
  // Pass original inputs back in results for chart components and other uses
  return {
    itemsPerPrintJob,
    monthlyPrintJobs,
    operatingHours,
    inkUsage: formattedInkUsage,
    inkCostPerUnit,
    laborCostPerUnit,
    materialCostPerUnit,
    costPerUnit,
    monthlySales,
    monthlyGrossProfit,
    grossProfitMargin,
    paybackPeriod,
    inputs // Include original inputs
  };
};

// Export a payback period status function for UI color coding
export const getPaybackStatus = (paybackPeriod) => {
  if (paybackPeriod === '-') {
    return 'no-profit';
  } else if (paybackPeriod <= paybackThresholds.good) {
    return 'good';
  } else if (paybackPeriod <= paybackThresholds.average) {
    return 'average';
  } else {
    return 'warning';
  }
};
