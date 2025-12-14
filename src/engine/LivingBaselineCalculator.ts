/**
 * Living Baseline Calculator - compares projected income vs living costs
 */

import { LivingBaseline, ValuationResult } from '../types/entities';

export interface BaselineCoverageReport {
  personId: string;
  period: 'monthly';
  currency: string;
  projectedGrossIncome: number;
  projectedNetIncome: number;
  requiredLivingCost: number;
  coverageRatio: number;
  shortfall: number;
  surplus: number;
  breakdown: {
    category: string;
    required: number;
    covered: boolean;
  }[];
  generatedAt: Date;
}

export class LivingBaselineCalculator {
  // Default tax rate for net income estimation
  // In production, this should be configurable per person/location
  private static readonly DEFAULT_TAX_RATE = 0.25; // 25%

  /**
   * Calculate monthly living cost baseline
   */
  public calculateMonthlyBaseline(baseline: LivingBaseline): number {
    const breakdown = baseline.monthlyBreakdown;
    return (
      breakdown.rent +
      breakdown.utilities +
      breakdown.internetMobile +
      breakdown.homeInsurance +
      breakdown.healthExpenses +
      breakdown.food +
      breakdown.transportation +
      breakdown.childcare +
      breakdown.debtPayments +
      breakdown.clothing +
      breakdown.medicine +
      breakdown.emergencyFundSavings +
      breakdown.leisureSocial +
      breakdown.taxesFees
    );
  }

  /**
   * Generate a coverage report comparing income to baseline
   */
  public generateCoverageReport(
    personId: string,
    baseline: LivingBaseline,
    monthlyValuations: ValuationResult[]
  ): BaselineCoverageReport {
    // Calculate projected monthly income from valuations
    let projectedGrossIncome = 0;
    
    for (const valuation of monthlyValuations) {
      const personPayout = valuation.participantPayouts.find(
        p => p.personId === personId
      );
      if (personPayout) {
        projectedGrossIncome += personPayout.grossPay;
        
        // Add bonuses
        for (const bonus of personPayout.bonuses) {
          projectedGrossIncome += bonus.amount;
        }
      }
    }

    // For now, assume 25% tax rate for net income estimation
    // In production, this should use actual tax calculations
    const estimatedTaxRate = LivingBaselineCalculator.DEFAULT_TAX_RATE;
    const projectedNetIncome = projectedGrossIncome * (1 - estimatedTaxRate);

    // Calculate required living cost
    const requiredLivingCost = this.calculateMonthlyBaseline(baseline);

    // Calculate coverage metrics
    const coverageRatio = requiredLivingCost > 0
      ? projectedNetIncome / requiredLivingCost
      : 0;
    
    const shortfall = Math.max(0, requiredLivingCost - projectedNetIncome);
    const surplus = Math.max(0, projectedNetIncome - requiredLivingCost);

    // Generate breakdown with coverage status
    const breakdown = this.generateBreakdown(baseline, projectedNetIncome);

    return {
      personId,
      period: 'monthly',
      currency: baseline.currency,
      projectedGrossIncome,
      projectedNetIncome,
      requiredLivingCost,
      coverageRatio,
      shortfall,
      surplus,
      breakdown,
      generatedAt: new Date()
    };
  }

  /**
   * Generate detailed breakdown by category
   */
  private generateBreakdown(
    baseline: LivingBaseline,
    projectedNetIncome: number
  ): { category: string; required: number; covered: boolean }[] {
    const totalRequired = this.calculateMonthlyBaseline(baseline);
    const coverageRatio = totalRequired > 0 ? projectedNetIncome / totalRequired : 0;

    return [
      {
        category: 'Rent/Mortgage',
        required: baseline.monthlyBreakdown.rent,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Utilities',
        required: baseline.monthlyBreakdown.utilities,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Internet/Mobile',
        required: baseline.monthlyBreakdown.internetMobile,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Home Insurance',
        required: baseline.monthlyBreakdown.homeInsurance,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Health Expenses',
        required: baseline.monthlyBreakdown.healthExpenses,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Food',
        required: baseline.monthlyBreakdown.food,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Transportation',
        required: baseline.monthlyBreakdown.transportation,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Childcare',
        required: baseline.monthlyBreakdown.childcare,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Debt Payments',
        required: baseline.monthlyBreakdown.debtPayments,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Clothing',
        required: baseline.monthlyBreakdown.clothing,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Medicine',
        required: baseline.monthlyBreakdown.medicine,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Emergency Fund',
        required: baseline.monthlyBreakdown.emergencyFundSavings,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Leisure/Social',
        required: baseline.monthlyBreakdown.leisureSocial,
        covered: coverageRatio >= 1.0
      },
      {
        category: 'Taxes/Fees',
        required: baseline.monthlyBreakdown.taxesFees,
        covered: coverageRatio >= 1.0
      }
    ];
  }

  /**
   * Check if baseline is adequate
   */
  public isBaselineAdequate(
    baseline: LivingBaseline,
    projectedNetIncome: number
  ): boolean {
    const required = this.calculateMonthlyBaseline(baseline);
    return projectedNetIncome >= required;
  }

  /**
   * Calculate recommended rate adjustment to meet baseline
   */
  public calculateRecommendedRateAdjustment(
    currentMonthlyIncome: number,
    baseline: LivingBaseline,
    currentMonthlyHours: number
  ): {
    currentHourlyEquivalent: number;
    requiredHourlyEquivalent: number;
    adjustmentPercentage: number;
  } {
    const required = this.calculateMonthlyBaseline(baseline);
    const currentHourlyEquivalent = currentMonthlyHours > 0
      ? currentMonthlyIncome / currentMonthlyHours
      : 0;
    
    const requiredHourlyEquivalent = currentMonthlyHours > 0
      ? required / currentMonthlyHours
      : 0;

    const adjustmentPercentage = currentHourlyEquivalent > 0
      ? ((requiredHourlyEquivalent - currentHourlyEquivalent) / currentHourlyEquivalent) * 100
      : 0;

    return {
      currentHourlyEquivalent,
      requiredHourlyEquivalent,
      adjustmentPercentage
    };
  }
}
