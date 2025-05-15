/**
 * MO-180 Sales Simulator Calculation Service
 * 
 * This module contains all the core calculation functions for the MO-180 Sales Simulation Tool.
 */

import { PRINTER_SPECIFICATIONS, UI_CONSTANTS } from '../config/constants';
import { safeNumber, safeDivide } from '../utils/formatters';

// Get printer constants from configuration
const { printSpeed: PRINT_SPEED, printableArea: PRINTABLE_AREA } = PRINTER_SPECIFICATIONS;
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
  // Convert inputs to safe numbers
  const safeShortEdge = safeNumber(shortEdge);
  const safeLongEdge = safeNumber(longEdge);
  
  // Validate inputs
  if (safeShortEdge <= 0 || safeLongEdge <= 0) {
    return 0;
  }
  
  // Handle case where dimensions exceed printable area
  if ((safeShortEdge > PRINTABLE_AREA.width && safeShortEdge > PRINTABLE_AREA.height) ||
      (safeLongEdge > PRINTABLE_AREA.width && safeLongEdge > PRINTABLE_AREA.height)) {
    return 0;
  }
  
  // Calculate items in first orientation (short edge along width, long edge along height)
  const orientation1 = Math.floor(PRINTABLE_AREA.width / safeShortEdge) * 
                      Math.floor(PRINTABLE_AREA.height / safeLongEdge);
  
  // Calculate items in second orientation (short edge along height, long edge along width)
  const orientation2 = Math.floor(PRINTABLE_AREA.width / safeLongEdge) * 
                      Math.floor(PRINTABLE_AREA.height / safeShortEdge);
  
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
  // Convert inputs to safe numbers
  const safeVolume = safeNumber(monthlySalesVolume);
  const safeItems = safeNumber(itemsPerPrintJob);
  
  // Handle division by zero or invalid inputs
  if (safeItems <= 0) {
    return 0;
  }
  
  // Ceil to ensure enough jobs are run
  return Math.ceil(safeVolume / safeItems);
};

/**
 * Calculate monthly operating hours
 * 
 * @param {number} monthlyPrintJobs - Number of monthly print jobs
 * @returns {number} Operating hours per month
 */
export const calculateOperatingHours = (monthlyPrintJobs) => {
  // Convert input to safe number and handle division by zero
  return safeDivide(safeNumber(monthlyPrintJobs), PRINT_SPEED);
};

/**
 * Calculate ink usage per item using the scaling formula
 * 
 * @param {number} shortEdge - Short edge dimension in mm
 * @returns {Object} Ink usage in cc for White, CMYK, and Primer
 */
export const calculateInkUsage = (shortEdge) => {
  // Convert input to safe number
  const safeShortEdge = safeNumber(shortEdge, 1); // Use 1 as fallback to avoid division by zero
  
  // Calculate scaling factor based on reference point (avoid division by zero)
  const scale = Math.pow(safeShortEdge / 65, 2);
  
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
  if (!inkUsage || typeof inkUsage !== 'object') {
    return 0;
  }
  
  // Convert inputs to safe numbers
  const safeWhite = safeNumber(inkUsage.white);
  const safeCMYK = safeNumber(inkUsage.cmyk);
  const safePrimer = safeNumber(inkUsage.primer);
  const safePrice = safeNumber(inkPricePerCC);
  
  const totalInkUsage = safeWhite + safeCMYK + safePrimer;
  return totalInkUsage * safePrice;
};

/**
 * Calculate labor cost per unit
 * 
 * @param {number} laborCostPerHour - Labor cost per hour in JPY
 * @param {number} itemsPerPrintJob - Number of items per print job
 * @returns {number} Labor cost per unit in JPY
 */
export const calculateLaborCostPerUnit = (laborCostPerHour, itemsPerPrintJob) => {
  // Convert inputs to safe numbers
  const safeLaborCost = safeNumber(laborCostPerHour);
  const safeItems = safeNumber(itemsPerPrintJob);
  
  // Use safe division to handle division by zero
  const printJobCost = safeDivide(safeLaborCost, PRINT_SPEED);
  return safeDivide(printJobCost, safeItems);
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
  // Convert inputs to safe numbers
  const safeMaterialCost = safeNumber(materialCostPerUnit);
  const safeInkCost = safeNumber(inkCostPerUnit);
  const safeLaborCost = safeNumber(laborCostPerUnit);
  
  return safeMaterialCost + safeInkCost + safeLaborCost;
};

/**
 * Calculate monthly sales
 * 
 * @param {number} salesPricePerUnit - Sales price per unit in JPY
 * @param {number} monthlySalesVolume - Monthly sales volume in units
 * @returns {number} Monthly sales in JPY
 */
export const calculateMonthlySales = (salesPricePerUnit, monthlySalesVolume) => {
  // Convert inputs to safe numbers
  const safePrice = safeNumber(salesPricePerUnit);
  const safeVolume = safeNumber(monthlySalesVolume);
  
  return safePrice * safeVolume;
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
  // Convert inputs to safe numbers
  const safePrice = safeNumber(salesPricePerUnit);
  const safeCost = safeNumber(costPerUnit);
  const safeVolume = safeNumber(monthlySalesVolume);
  
  return (safePrice - safeCost) * safeVolume;
};

/**
 * Calculate gross profit margin as a percentage
 * 
 * @param {number} salesPricePerUnit - Sales price per unit in JPY
 * @param {number} costPerUnit - Total cost per unit in JPY
 * @returns {number} Gross profit margin as a percentage
 */
export const calculateGrossProfitMargin = (salesPricePerUnit, costPerUnit) => {
  // Convert inputs to safe numbers
  const safePrice = safeNumber(salesPricePerUnit);
  const safeCost = safeNumber(costPerUnit);
  
  // Handle division by zero using safe division
  return safeDivide((safePrice - safeCost), safePrice, 0) * 100;
};

/**
 * Calculate investment payback period in months
 * 
 * @param {number} monthlyGrossProfit - Monthly gross profit in JPY
 * @param {number} initialInvestment - Initial investment amount in JPY
 * @returns {number|string} Payback period in months or '-' if no profit
 */
export const calculatePaybackPeriod = (monthlyGrossProfit, initialInvestment) => {
  // Convert inputs to safe numbers
  const safeProfit = safeNumber(monthlyGrossProfit);
  const safeInvestment = safeNumber(initialInvestment);
  
  // Handle no profit case
  if (safeProfit <= 0) {
    return '-';
  }
  
  return safeDivide(safeInvestment, safeProfit, '-');
};

/**
 * Perform all calculations and return complete results
 * 
 * @param {Object} inputs - All user inputs
 * @returns {Object} Complete calculation results
 */
export const calculateResults = (inputs) => {
  // Performance tracking
  const startTime = performance.now();
  
  // Handle null or undefined inputs
  if (!inputs) {
    console.error('Invalid inputs provided to calculation service');
    return null;
  }
  
  const {
    shortEdge,
    longEdge,
    salesPricePerUnit,
    monthlySalesVolume,
    materialCostPerUnit,
    laborCostPerHour,
    inkPricePerCC,
    initialInvestment = PRINTER_SPECIFICATIONS.initialInvestment // Use default if not provided
  } = inputs;
  
  try {
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
    const paybackPeriod = calculatePaybackPeriod(monthlyGrossProfit, initialInvestment);
    
    // Format ink usage to 2 decimal places
    const formattedInkUsage = {
      white: parseFloat(inkUsage.white.toFixed(2)),
      cmyk: parseFloat(inkUsage.cmyk.toFixed(2)),
      primer: parseFloat(inkUsage.primer.toFixed(2))
    };
    
    // Log performance
    const endTime = performance.now();
    console.log(`Calculation completed in ${(endTime - startTime).toFixed(2)}ms`);
    
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
      initialInvestment, // Include the initial investment value
      inputs // Include original inputs
    };
  } catch (error) {
    console.error('Error in calculation service:', error);
    // Return default/fallback values in case of error
    return {
      itemsPerPrintJob: 0,
      monthlyPrintJobs: 0,
      operatingHours: 0,
      inkUsage: { white: 0, cmyk: 0, primer: 0 },
      inkCostPerUnit: 0,
      laborCostPerUnit: 0,
      materialCostPerUnit: safeNumber(materialCostPerUnit),
      costPerUnit: safeNumber(materialCostPerUnit),
      monthlySales: 0,
      monthlyGrossProfit: 0,
      grossProfitMargin: 0,
      paybackPeriod: '-',
      initialInvestment: safeNumber(initialInvestment),
      inputs
    };
  }
};

/**
 * Get payback period status for UI color coding
 * @param {number|string} paybackPeriod - Payback period in months or '-' for no profit
 * @returns {string} - Status code ('good', 'average', 'warning', or 'no-profit')
 */
export const getPaybackStatus = (paybackPeriod) => {
  if (paybackPeriod === '-' || paybackPeriod === undefined || paybackPeriod === null) {
    return 'no-profit';
  } else if (paybackPeriod <= paybackThresholds.good) {
    return 'good';
  } else if (paybackPeriod <= paybackThresholds.average) {
    return 'average';
  } else {
    return 'warning';
  }
};
