/**
 * Payment utilities - helper functions for payment calculations
 */

import { PaymentType, PaymentComponent } from '../types/entities';

export interface PaymentPolicy {
  type: PaymentType;
  enabled: boolean;
  calculationMethod: 'fixed' | 'percentage' | 'multiplier' | 'tiered';
  value: number;
  conditions?: {
    minHours?: number;
    maxHours?: number;
    timeOfDay?: 'day' | 'night' | 'any';
    dayOfWeek?: 'weekday' | 'weekend' | 'holiday' | 'any';
    qualityThreshold?: number;
    complexityThreshold?: number;
  };
}

export class PaymentCalculator {
  /**
   * Calculate overtime pay
   */
  public static calculateOvertime(
    baseRate: number,
    overtimeHours: number,
    multiplier: number = 1.5
  ): PaymentComponent {
    return {
      type: PaymentType.OVERTIME,
      amount: baseRate * overtimeHours * multiplier,
      description: `Overtime: ${overtimeHours.toFixed(1)}h at ${multiplier}x`,
      calculationBasis: `${baseRate} * ${overtimeHours} * ${multiplier}`
    };
  }

  /**
   * Calculate night differential
   */
  public static calculateNightDifferential(
    baseRate: number,
    nightHours: number,
    differential: number = 0.15
  ): PaymentComponent {
    return {
      type: PaymentType.NIGHT_DIFFERENTIAL,
      amount: baseRate * nightHours * differential,
      description: `Night differential: ${(differential * 100).toFixed(0)}% for ${nightHours.toFixed(1)}h`,
      calculationBasis: `${baseRate} * ${nightHours} * ${differential}`
    };
  }

  /**
   * Calculate weekend differential
   */
  public static calculateWeekendDifferential(
    baseRate: number,
    weekendHours: number,
    differential: number = 0.20
  ): PaymentComponent {
    return {
      type: PaymentType.WEEKEND_DIFFERENTIAL,
      amount: baseRate * weekendHours * differential,
      description: `Weekend differential: ${(differential * 100).toFixed(0)}% for ${weekendHours.toFixed(1)}h`,
      calculationBasis: `${baseRate} * ${weekendHours} * ${differential}`
    };
  }

  /**
   * Calculate milestone bonus
   */
  public static calculateMilestoneBonus(
    baseValue: number,
    bonusPercentage: number = 0.10
  ): PaymentComponent {
    return {
      type: PaymentType.MILESTONE_BONUS,
      amount: baseValue * bonusPercentage,
      description: `Milestone bonus: ${(bonusPercentage * 100).toFixed(0)}%`,
      calculationBasis: `${baseValue} * ${bonusPercentage}`
    };
  }

  /**
   * Calculate delivery bonus (on-time, on-scope)
   */
  public static calculateDeliveryBonus(
    baseValue: number,
    onTime: boolean,
    onScope: boolean,
    bonusPercentage: number = 0.05
  ): PaymentComponent | null {
    if (onTime && onScope) {
      return {
        type: PaymentType.DELIVERY_BONUS,
        amount: baseValue * bonusPercentage,
        description: `Delivery bonus: on-time and on-scope`,
        calculationBasis: `${baseValue} * ${bonusPercentage}`
      };
    }
    return null;
  }

  /**
   * Calculate quality bonus
   */
  public static calculateQualityBonus(
    baseValue: number,
    qualityScore: number,
    threshold: number = 0.90,
    bonusPercentage: number = 0.05
  ): PaymentComponent | null {
    if (qualityScore >= threshold) {
      return {
        type: PaymentType.QUALITY_BONUS,
        amount: baseValue * bonusPercentage,
        description: `Quality bonus: ${(qualityScore * 100).toFixed(0)}% score`,
        calculationBasis: `${baseValue} * ${bonusPercentage}`
      };
    }
    return null;
  }

  /**
   * Calculate urgency fee
   */
  public static calculateUrgencyFee(
    baseValue: number,
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  ): PaymentComponent | null {
    const multipliers = {
      low: 0,
      medium: 0.05,
      high: 0.15,
      critical: 0.30
    };

    const multiplier = multipliers[urgencyLevel];
    if (multiplier > 0) {
      return {
        type: PaymentType.URGENCY_FEE,
        amount: baseValue * multiplier,
        description: `Urgency fee: ${urgencyLevel} priority`,
        calculationBasis: `${baseValue} * ${multiplier}`
      };
    }
    return null;
  }

  /**
   * Calculate risk premium
   */
  public static calculateRiskPremium(
    baseValue: number,
    riskLevel: number, // 0.0 - 1.0
    maxPremiumPercentage: number = 0.25
  ): PaymentComponent {
    const premiumPercentage = riskLevel * maxPremiumPercentage;
    return {
      type: PaymentType.RISK_PREMIUM,
      amount: baseValue * premiumPercentage,
      description: `Risk premium: ${(riskLevel * 100).toFixed(0)}% risk level`,
      calculationBasis: `${baseValue} * ${premiumPercentage}`
    };
  }

  /**
   * Calculate scrum ceremonies allocation
   */
  public static calculateScrumCeremoniesAllocation(
    hourlyRate: number,
    ceremonyHours: number
  ): PaymentComponent {
    return {
      type: PaymentType.SCRUM_CEREMONIES,
      amount: hourlyRate * ceremonyHours,
      description: `Scrum ceremonies: ${ceremonyHours.toFixed(1)}h`,
      calculationBasis: `${hourlyRate} * ${ceremonyHours}`
    };
  }

  /**
   * Calculate code review allocation
   */
  public static calculateCodeReviewAllocation(
    hourlyRate: number,
    reviewHours: number
  ): PaymentComponent {
    return {
      type: PaymentType.CODE_REVIEW,
      amount: hourlyRate * reviewHours,
      description: `Code review: ${reviewHours.toFixed(1)}h`,
      calculationBasis: `${hourlyRate} * ${reviewHours}`
    };
  }

  /**
   * Calculate on-call pay
   */
  public static calculateOnCallPay(
    baseRate: number,
    onCallHours: number,
    onCallRate: number = 0.25 // 25% of base for standby
  ): PaymentComponent {
    return {
      type: PaymentType.ON_CALL_PAY,
      amount: baseRate * onCallHours * onCallRate,
      description: `On-call standby: ${onCallHours.toFixed(1)}h`,
      calculationBasis: `${baseRate} * ${onCallHours} * ${onCallRate}`
    };
  }

  /**
   * Calculate stipend (fixed amount)
   */
  public static calculateStipend(
    type: PaymentType,
    amount: number,
    description: string
  ): PaymentComponent {
    return {
      type,
      amount,
      description,
      calculationBasis: 'fixed'
    };
  }

  /**
   * Calculate total from payment components
   */
  public static calculateTotal(components: PaymentComponent[]): number {
    return components.reduce((sum, component) => sum + component.amount, 0);
  }

  /**
   * Group payment components by type
   */
  public static groupByType(
    components: PaymentComponent[]
  ): Map<PaymentType, PaymentComponent[]> {
    const grouped = new Map<PaymentType, PaymentComponent[]>();
    
    for (const component of components) {
      const existing = grouped.get(component.type) || [];
      existing.push(component);
      grouped.set(component.type, existing);
    }

    return grouped;
  }

  /**
   * Apply payment policy to calculate component
   */
  public static applyPolicy(
    policy: PaymentPolicy,
    baseValue: number,
    context: {
      hours?: number;
      qualityScore?: number;
      complexity?: number;
      timeOfDay?: 'day' | 'night';
      dayOfWeek?: 'weekday' | 'weekend' | 'holiday';
    }
  ): PaymentComponent | null {
    if (!policy.enabled) {
      return null;
    }

    // Check conditions
    if (policy.conditions) {
      const { conditions } = policy;
      
      if (conditions.minHours !== undefined && (!context.hours || context.hours < conditions.minHours)) {
        return null;
      }
      
      if (conditions.maxHours !== undefined && context.hours && context.hours > conditions.maxHours) {
        return null;
      }
      
      if (conditions.timeOfDay && conditions.timeOfDay !== 'any' && context.timeOfDay !== conditions.timeOfDay) {
        return null;
      }
      
      if (conditions.dayOfWeek && conditions.dayOfWeek !== 'any' && context.dayOfWeek !== conditions.dayOfWeek) {
        return null;
      }
      
      if (conditions.qualityThreshold !== undefined && 
          (!context.qualityScore || context.qualityScore < conditions.qualityThreshold)) {
        return null;
      }
      
      if (conditions.complexityThreshold !== undefined && 
          (!context.complexity || context.complexity < conditions.complexityThreshold)) {
        return null;
      }
    }

    // Calculate amount based on method
    let amount = 0;
    let calculationBasis = '';

    switch (policy.calculationMethod) {
      case 'fixed':
        amount = policy.value;
        calculationBasis = `fixed: ${policy.value}`;
        break;
      
      case 'percentage':
        // Percentage: policy.value is a decimal (e.g., 0.15 for 15%)
        amount = baseValue * policy.value;
        calculationBasis = `${baseValue} * ${policy.value}`;
        break;
      
      case 'multiplier':
        // Multiplier: policy.value is a factor (e.g., 1.5 for time-and-a-half)
        // Semantically similar to percentage, but represents a multiplier concept
        amount = baseValue * policy.value;
        calculationBasis = `${baseValue} * ${policy.value}`;
        break;
      
      case 'tiered':
        // Tiered would require additional configuration
        amount = baseValue * policy.value;
        calculationBasis = `tiered: ${baseValue} * ${policy.value}`;
        break;
    }

    return {
      type: policy.type,
      amount,
      description: `Policy: ${policy.type}`,
      calculationBasis
    };
  }
}
