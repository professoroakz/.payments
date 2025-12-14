/**
 * Task Valuation Engine - calculates compensation and cost for tasks
 */

import {
  TaskLedgerEntry,
  TaskParticipant,
  RatePlan,
  CostProfile,
  ValuationResult,
  ParticipantPayout,
  CostBreakdown,
  RoleType,
  PaymentComponent,
  PaymentType
} from '../types/entities';

export interface ValuationConfig {
  applyComplexityMultiplier: boolean;
  applyQualityMultiplier: boolean;
  applyEstimateVariance: boolean;
  minQualityMultiplier: number;
  maxQualityMultiplier: number;
  minComplexityMultiplier: number;
  maxComplexityMultiplier: number;
}

export const DEFAULT_VALUATION_CONFIG: ValuationConfig = {
  applyComplexityMultiplier: true,
  applyQualityMultiplier: true,
  applyEstimateVariance: false,
  minQualityMultiplier: 0.8,
  maxQualityMultiplier: 1.2,
  minComplexityMultiplier: 0.8,
  maxComplexityMultiplier: 2.5
};

export class TaskValuationEngine {
  private config: ValuationConfig;

  constructor(config: ValuationConfig = DEFAULT_VALUATION_CONFIG) {
    this.config = config;
  }

  /**
   * Calculate the complete valuation for a task
   */
  public calculateTaskValuation(
    ledgerEntry: TaskLedgerEntry,
    ratePlans: Map<string, RatePlan>,
    costProfile: CostProfile
  ): ValuationResult {
    const participantPayouts: ParticipantPayout[] = [];
    let totalLaborValue = 0;

    // Calculate payout for each participant
    for (const participant of ledgerEntry.participants) {
      const ratePlan = ratePlans.get(participant.personId);
      if (!ratePlan) {
        throw new Error(`Rate plan not found for person ${participant.personId}`);
      }

      const payout = this.calculateParticipantPayout(
        participant,
        ratePlan,
        ledgerEntry.complexity,
        ledgerEntry.qualityScore,
        ledgerEntry.estimatedHours,
        ledgerEntry.actualHours
      );

      participantPayouts.push(payout);
      totalLaborValue += payout.grossPay;
    }

    // Calculate employer costs
    const costBreakdown = this.calculateEmployerCost(
      totalLaborValue,
      costProfile
    );

    return {
      taskId: ledgerEntry.cardId,
      totalLaborValue,
      totalEmployerCost: costBreakdown.totalCost,
      currency: costProfile.currency,
      participantPayouts,
      costBreakdown,
      calculatedAt: new Date()
    };
  }

  /**
   * Calculate payout for a single participant
   */
  private calculateParticipantPayout(
    participant: TaskParticipant,
    ratePlan: RatePlan,
    taskComplexity: number,
    qualityScore: number | undefined,
    estimatedHours: number | undefined,
    actualHours: number
  ): ParticipantPayout {
    const trackedHours = participant.trackedTimeSeconds / 3600;
    
    // Base labor value
    const effectiveRate = this.calculateEffectiveRate(ratePlan);
    let baseValue = trackedHours * effectiveRate;

    // Apply complexity multiplier
    const complexityMultiplier = this.config.applyComplexityMultiplier
      ? this.clamp(taskComplexity, this.config.minComplexityMultiplier, this.config.maxComplexityMultiplier)
      : 1.0;

    // Apply quality multiplier
    const qualityMultiplier = this.config.applyQualityMultiplier && qualityScore !== undefined
      ? this.clamp(
          0.8 + (qualityScore * 0.4), // Maps 0-1 quality to 0.8-1.2 multiplier
          this.config.minQualityMultiplier,
          this.config.maxQualityMultiplier
        )
      : 1.0;

    // Calculate gross pay
    const grossPay = baseValue * complexityMultiplier * qualityMultiplier;

    // Calculate bonuses and adjustments
    const bonuses: PaymentComponent[] = [];
    const adjustments: PaymentComponent[] = [];

    // Quality bonus if applicable
    if (qualityScore !== undefined && qualityScore >= 0.9) {
      const bonusAmount = grossPay * 0.05; // 5% quality bonus
      bonuses.push({
        type: PaymentType.QUALITY_BONUS,
        amount: bonusAmount,
        description: `High quality score: ${(qualityScore * 100).toFixed(0)}%`
      });
    }

    // Estimate variance check (for learning, not penalty)
    if (estimatedHours !== undefined && actualHours > estimatedHours * 1.5) {
      adjustments.push({
        type: PaymentType.REWORK_PENALTY,
        amount: 0,
        description: `Flagged for review: actual ${actualHours.toFixed(1)}h vs estimated ${estimatedHours.toFixed(1)}h`,
        calculationBasis: 'learning_flag'
      });
    }

    return {
      personId: participant.personId,
      roleType: participant.roleType,
      trackedHours,
      baseRate: effectiveRate,
      complexityMultiplier,
      qualityMultiplier,
      grossPay,
      bonuses,
      adjustments
    };
  }

  /**
   * Calculate effective hourly rate based on rate plan type
   */
  private calculateEffectiveRate(ratePlan: RatePlan): number {
    switch (ratePlan.type) {
      case 'hourly':
        return ratePlan.baseRate;
      
      case 'daily':
        // Assume 8-hour day
        return ratePlan.baseRate / 8;
      
      case 'weekly':
        // Assume 40-hour week
        return ratePlan.baseRate / 40;
      
      case 'monthly_salary':
        // Assume 160 hours per month (4 weeks * 40 hours)
        return ratePlan.baseRate / 160;
      
      default:
        return ratePlan.baseRate;
    }
  }

  /**
   * Calculate employer cost breakdown
   */
  private calculateEmployerCost(
    totalLaborValue: number,
    costProfile: CostProfile
  ): CostBreakdown {
    const directLabor = totalLaborValue;
    const payrollBurden = directLabor * costProfile.payrollBurdenRate;
    const toolingAllocation = costProfile.toolingCostPerMonth / 160; // Per hour estimate
    const overheadAllocation = directLabor * costProfile.overheadAllocationRate;
    const contingency = (directLabor + payrollBurden + overheadAllocation) * costProfile.contingencyRate;
    
    const totalCost = directLabor + payrollBurden + toolingAllocation + overheadAllocation + contingency;

    return {
      directLabor,
      payrollBurden,
      toolingAllocation,
      overheadAllocation,
      contingency,
      totalCost
    };
  }

  /**
   * Calculate role-based weight allocation
   * This determines how task value is distributed among roles
   */
  public calculateRoleWeights(
    participants: TaskParticipant[]
  ): Map<string, number> {
    const weights = new Map<string, number>();
    let totalWeight = 0;

    // Sum up all weights
    for (const participant of participants) {
      totalWeight += participant.weight;
    }

    // Normalize to percentages
    for (const participant of participants) {
      const normalizedWeight = totalWeight > 0 ? participant.weight / totalWeight : 0;
      weights.set(participant.personId, normalizedWeight);
    }

    return weights;
  }

  /**
   * Get default role weight based on role type
   */
  public static getDefaultRoleWeight(roleType: RoleType): number {
    const weights: Record<RoleType, number> = {
      [RoleType.DEVELOPER]: 0.70,
      [RoleType.ASSIGNEE]: 0.70,
      [RoleType.QA]: 0.15,
      [RoleType.REVIEWER]: 0.10,
      [RoleType.SCRUM_MASTER]: 0.10,
      [RoleType.PROJECT_MANAGER]: 0.15,
      [RoleType.DESIGNER]: 0.20,
      [RoleType.CLIENT_APPROVER]: 0.00,
      [RoleType.OPS_SRE]: 0.15,
      [RoleType.STAKEHOLDER]: 0.00
    };

    return weights[roleType] || 0.10;
  }

  /**
   * Utility function to clamp a value between min and max
   */
  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
