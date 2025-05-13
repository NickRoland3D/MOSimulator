/**
 * MOSimulator Configuration
 * Central place for all application constants and default values
 */

// Printer specifications
export const PRINTER_SPECIFICATIONS = {
  name: 'MO-180',
  initialInvestment: 3780000, // JPY (default value)
  printSpeed: 6, // prints per hour
  printableArea: {
    width: 305, // mm
    height: 458, // mm
  }
};

// Default input values
export const DEFAULT_INPUTS = {
  shortEdge: 90,
  longEdge: 90,
  salesPricePerUnit: 2500,
  monthlySalesVolume: 300,
  materialCostPerUnit: 200,
  laborCostPerHour: 2000,
  inkPricePerCC: 18,
  initialInvestment: PRINTER_SPECIFICATIONS.initialInvestment // Adding to inputs for dynamic updates
};

// UI constants
export const UI_CONSTANTS = {
  // Input ranges
  ranges: {
    shortEdge: { min: 10, max: 305 },
    longEdge: { min: 10, max: 458 },
    salesPricePerUnit: { min: 0, max: null },
    monthlySalesVolume: { min: 0, max: 1000 },
    materialCostPerUnit: { min: 0, max: null },
    laborCostPerHour: { min: 0, max: null },
    inkPricePerCC: { min: 0, max: null },
    initialInvestment: { min: 1, max: null } // Adding range for initialInvestment
  },
  
  // Step sizes for increment/decrement
  steps: {
    shortEdge: 5,
    longEdge: 5,
    salesPricePerUnit: 50,
    monthlySalesVolume: 10,
    materialCostPerUnit: 10,
    laborCostPerHour: 100,
    inkPricePerCC: 1,
    initialInvestment: 100000 // Adding step size for initialInvestment
  },
  
  // Chart colors (CMYK-inspired)
  chartColors: {
    cyan: '#00AEEF',    // Material costs
    magenta: '#EC008C', // Ink costs
    yellow: '#FFF200',  // Labor costs
    black: '#000000'    // Misc/accents
  },
  
  // Payback period thresholds (in months)
  paybackThresholds: {
    good: 12,      // Excellent investment (green)
    average: 24,   // Good investment (yellow/orange)
    warning: 60    // Consider carefully (red)
  }
};

export default {
  PRINTER_SPECIFICATIONS,
  DEFAULT_INPUTS,
  UI_CONSTANTS
};
