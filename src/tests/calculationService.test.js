/**
 * Test suite for calculation service
 * Tests the core calculation functions to ensure they work correctly
 */

import { 
  calculateItemsPerPrintJob,
  calculateMonthlyPrintJobs,
  calculateOperatingHours,
  calculateInkUsage,
  calculateInkCostPerUnit,
  calculateLaborCostPerUnit,
  calculateCostPerUnit,
  calculateMonthlySales,
  calculateMonthlyGrossProfit,
  calculateGrossProfitMargin,
  calculatePaybackPeriod,
  calculateResults,
  getPaybackStatus
} from '../services/calculationService';

import { PRINTER_SPECIFICATIONS } from '../config/constants';

describe('Calculation Service', () => {
  // Test calculateItemsPerPrintJob
  describe('calculateItemsPerPrintJob', () => {
    test('handles invalid inputs', () => {
      expect(calculateItemsPerPrintJob(0, 10)).toBe(0);
      expect(calculateItemsPerPrintJob(-5, 10)).toBe(0);
      expect(calculateItemsPerPrintJob(10, 0)).toBe(0);
      expect(calculateItemsPerPrintJob(null, 10)).toBe(0);
      expect(calculateItemsPerPrintJob(undefined, 10)).toBe(0);
      expect(calculateItemsPerPrintJob('abc', 10)).toBe(0);
    });
    
    test('handles dimensions exceeding printable area', () => {
      const { width, height } = PRINTER_SPECIFICATIONS.printableArea;
      expect(calculateItemsPerPrintJob(width + 10, height + 10)).toBe(0);
    });
    
    test('calculates correct values for valid inputs', () => {
      const { width, height } = PRINTER_SPECIFICATIONS.printableArea;
      
      // One item should fit exactly
      expect(calculateItemsPerPrintJob(width, height)).toBe(1);
      
      // Two items should fit horizontally
      expect(calculateItemsPerPrintJob(width / 2, height)).toBe(2);
      
      // Small items should fit many
      expect(calculateItemsPerPrintJob(50, 50)).toBeGreaterThan(1);
    });
    
    test('considers both orientations', () => {
      // Test asymmetric dimensions
      const result1 = calculateItemsPerPrintJob(100, 200);
      const result2 = calculateItemsPerPrintJob(200, 100);
      
      // Results should be the same since the function tries both orientations
      expect(result1).toBe(result2);
    });
  });
  
  // Test calculateMonthlyPrintJobs
  describe('calculateMonthlyPrintJobs', () => {
    test('handles division by zero', () => {
      expect(calculateMonthlyPrintJobs(100, 0)).toBe(0);
    });
    
    test('rounds up to ensure enough jobs', () => {
      // If 3 items per job and 10 items total, we need 4 jobs (not 3.33)
      expect(calculateMonthlyPrintJobs(10, 3)).toBe(4);
    });
    
    test('handles invalid inputs', () => {
      expect(calculateMonthlyPrintJobs(null, 5)).toBe(0);
      expect(calculateMonthlyPrintJobs('abc', 5)).toBe(0);
    });
  });
  
  // Test calculateOperatingHours
  describe('calculateOperatingHours', () => {
    test('calculates hours correctly based on print speed', () => {
      const printSpeed = PRINTER_SPECIFICATIONS.printSpeed;
      expect(calculateOperatingHours(printSpeed)).toBe(1); // One hour for printSpeed jobs
      expect(calculateOperatingHours(printSpeed * 2)).toBe(2); // Two hours for 2x printSpeed jobs
    });
    
    test('handles invalid inputs', () => {
      expect(calculateOperatingHours(null)).toBe(0);
      expect(calculateOperatingHours('abc')).toBe(0);
    });
  });
  
  // Test ink usage calculations
  describe('ink calculations', () => {
    test('calculateInkUsage scales based on dimensions', () => {
      const baseSize = 65; // Reference size in the formula
      const baseUsage = calculateInkUsage(baseSize);
      
      // Double the size should quadruple the ink usage (power of 2)
      const doubleSize = baseSize * 2;
      const doubleUsage = calculateInkUsage(doubleSize);
      
      expect(doubleUsage.white).toBeCloseTo(baseUsage.white * 4, 2);
      expect(doubleUsage.cmyk).toBeCloseTo(baseUsage.cmyk * 4, 2);
      expect(doubleUsage.primer).toBeCloseTo(baseUsage.primer * 4, 2);
    });
    
    test('calculateInkCostPerUnit computes total cost correctly', () => {
      const inkUsage = { white: 0.1, cmyk: 0.1, primer: 0.05 };
      const inkPrice = 20;
      const expectedCost = (0.1 + 0.1 + 0.05) * 20;
      
      expect(calculateInkCostPerUnit(inkUsage, inkPrice)).toBe(expectedCost);
    });
    
    test('handles invalid inputs', () => {
      expect(calculateInkCostPerUnit(null, 20)).toBe(0);
      expect(calculateInkCostPerUnit({}, 20)).toBe(0);
      expect(calculateInkCostPerUnit({ white: 'abc' }, 20)).toBe(0);
    });
  });
  
  // Test cost calculations
  describe('cost calculations', () => {
    test('calculateCostPerUnit sums all costs', () => {
      expect(calculateCostPerUnit(100, 50, 30)).toBe(180);
    });
    
    test('calculateMonthlySales multiplies price by volume', () => {
      expect(calculateMonthlySales(500, 200)).toBe(100000);
    });
    
    test('calculateMonthlyGrossProfit computes profit correctly', () => {
      expect(calculateMonthlyGrossProfit(1000, 600, 100)).toBe(40000);
    });
    
    test('calculateGrossProfitMargin handles zero sales price', () => {
      expect(calculateGrossProfitMargin(0, 100)).toBe(0);
    });
    
    test('calculateGrossProfitMargin calculates percentage correctly', () => {
      expect(calculateGrossProfitMargin(1000, 600)).toBe(40); // 40%
    });
  });
  
  // Test payback period
  describe('payback period', () => {
    test('calculatePaybackPeriod handles no profit case', () => {
      expect(calculatePaybackPeriod(0, 1000000)).toBe('-');
      expect(calculatePaybackPeriod(-1000, 1000000)).toBe('-');
    });
    
    test('calculatePaybackPeriod calculates months correctly', () => {
      // 1,000,000 investment with 100,000 monthly profit = 10 months payback
      expect(calculatePaybackPeriod(100000, 1000000)).toBe(10);
    });
    
    test('getPaybackStatus returns correct status', () => {
      expect(getPaybackStatus('-')).toBe('no-profit');
      expect(getPaybackStatus(6)).toBe('good');
      expect(getPaybackStatus(18)).toBe('average');
      expect(getPaybackStatus(36)).toBe('warning');
    });
  });
  
  // Test complete calculation
  describe('calculateResults', () => {
    const sampleInputs = {
      shortEdge: 100,
      longEdge: 100,
      salesPricePerUnit: 1000,
      monthlySalesVolume: 300,
      materialCostPerUnit: 200,
      laborCostPerHour: 2000,
      inkPricePerCC: 18,
      initialInvestment: 3780000
    };
    
    test('returns a complete results object', () => {
      const results = calculateResults(sampleInputs);
      
      // Check that all expected properties exist
      expect(results).toHaveProperty('itemsPerPrintJob');
      expect(results).toHaveProperty('monthlyPrintJobs');
      expect(results).toHaveProperty('operatingHours');
      expect(results).toHaveProperty('inkUsage');
      expect(results).toHaveProperty('inkCostPerUnit');
      expect(results).toHaveProperty('costPerUnit');
      expect(results).toHaveProperty('monthlySales');
      expect(results).toHaveProperty('monthlyGrossProfit');
      expect(results).toHaveProperty('grossProfitMargin');
      expect(results).toHaveProperty('paybackPeriod');
      
      // Original inputs should be included
      expect(results.inputs).toEqual(sampleInputs);
    });
    
    test('handles error cases gracefully', () => {
      // Test with null inputs
      const results = calculateResults(null);
      expect(results).toBeNull();
      
      // Test with invalid inputs that would cause errors
      const badInputs = { ...sampleInputs, shortEdge: 'abc' };
      const badResults = calculateResults(badInputs);
      
      // Should still return an object with default values
      expect(badResults).toHaveProperty('itemsPerPrintJob');
      expect(badResults.itemsPerPrintJob).toBe(0);
    });
  });
});
