/**
 * Complete usage example demonstrating all major features
 */

import {
  TaskValuationEngine,
  LivingBaselineCalculator,
  PaymentCalculator,
  TaskLedgerEntry,
  RatePlan,
  CostProfile,
  LivingBaseline,
  RoleType
} from './index';

import { ratePlanExamples } from './models/ratePlanExamples';
import { costProfileExamples } from './models/costProfileExamples';
import { livingBaselineExamples } from './models/livingBaselineExamples';

/**
 * Example 1: Calculate task valuation for a development task
 */
function exampleTaskValuation() {
  console.log('\n=== Example 1: Task Valuation ===\n');

  // Create valuation engine
  const engine = new TaskValuationEngine();

  // Setup rate plans for team members
  const ratePlans = new Map<string, RatePlan>();
  
  ratePlans.set('dev-001', {
    id: 'rate-dev-001',
    personId: 'dev-001',
    workspaceId: 'ws-001',
    type: 'hourly',
    baseRate: 75.00,
    currency: 'USD',
    effectiveFrom: new Date(),
    overtimeMultiplier: 1.5,
    nightDifferential: 0.15,
    weekendDifferential: 0.20
  });

  ratePlans.set('qa-001', {
    id: 'rate-qa-001',
    personId: 'qa-001',
    workspaceId: 'ws-001',
    type: 'hourly',
    baseRate: 55.00,
    currency: 'USD',
    effectiveFrom: new Date()
  });

  ratePlans.set('reviewer-001', {
    id: 'rate-reviewer-001',
    personId: 'reviewer-001',
    workspaceId: 'ws-001',
    type: 'hourly',
    baseRate: 85.00,
    currency: 'USD',
    effectiveFrom: new Date()
  });

  // Setup cost profile
  const costProfile: CostProfile = {
    id: 'cost-001',
    workspaceId: 'ws-001',
    country: 'US',
    name: 'US Standard Employee Cost',
    payrollBurdenRate: 0.30,
    toolingCostPerMonth: 500,
    overheadAllocationRate: 0.25,
    contingencyRate: 0.10,
    currency: 'USD'
  };

  // Create a task ledger entry
  const ledgerEntry: TaskLedgerEntry = {
    id: 'entry-001',
    cardId: 'card-001',
    workspaceId: 'ws-001',
    projectId: 'proj-001',
    participants: [
      {
        personId: 'dev-001',
        roleType: RoleType.DEVELOPER,
        weight: 0.70,
        trackedTimeSeconds: 14400 // 4 hours
      },
      {
        personId: 'qa-001',
        roleType: RoleType.QA,
        weight: 0.15,
        trackedTimeSeconds: 5400 // 1.5 hours
      },
      {
        personId: 'reviewer-001',
        roleType: RoleType.REVIEWER,
        weight: 0.15,
        trackedTimeSeconds: 1800 // 0.5 hours
      }
    ],
    timeEntries: ['time-001', 'time-002', 'time-003'],
    estimatedHours: 6,
    actualHours: 6,
    complexity: 1.5,
    qualityScore: 0.95,
    approvedBy: 'pm-001',
    approvedAt: new Date(),
    postedAt: new Date(),
    isLocked: true,
    valuationResult: null as any
  };

  // Calculate valuation
  const result = engine.calculateTaskValuation(ledgerEntry, ratePlans, costProfile);

  console.log('Task Valuation Results:');
  console.log(`Total Labor Value: $${result.totalLaborValue.toFixed(2)}`);
  console.log(`Total Employer Cost: $${result.totalEmployerCost.toFixed(2)}`);
  console.log(`\nCost Breakdown:`);
  console.log(`  Direct Labor: $${result.costBreakdown.directLabor.toFixed(2)}`);
  console.log(`  Payroll Burden (30%): $${result.costBreakdown.payrollBurden.toFixed(2)}`);
  console.log(`  Tooling: $${result.costBreakdown.toolingAllocation.toFixed(2)}`);
  console.log(`  Overhead (25%): $${result.costBreakdown.overheadAllocation.toFixed(2)}`);
  console.log(`  Contingency (10%): $${result.costBreakdown.contingency.toFixed(2)}`);

  console.log(`\nParticipant Payouts:`);
  for (const payout of result.participantPayouts) {
    console.log(`  ${payout.roleType} (${payout.personId}):`);
    console.log(`    Hours: ${payout.trackedHours.toFixed(2)}`);
    console.log(`    Base Rate: $${payout.baseRate.toFixed(2)}/hr`);
    console.log(`    Complexity Multiplier: ${payout.complexityMultiplier.toFixed(2)}x`);
    console.log(`    Quality Multiplier: ${payout.qualityMultiplier.toFixed(2)}x`);
    console.log(`    Gross Pay: $${payout.grossPay.toFixed(2)}`);
    if (payout.bonuses.length > 0) {
      console.log(`    Bonuses:`);
      for (const bonus of payout.bonuses) {
        console.log(`      - ${bonus.description}: $${bonus.amount.toFixed(2)}`);
      }
    }
  }

  return result;
}

/**
 * Example 2: Living baseline coverage analysis
 */
function exampleLivingBaseline(monthlyValuations: any[]) {
  console.log('\n=== Example 2: Living Baseline Coverage ===\n');

  const calculator = new LivingBaselineCalculator();

  // Define living baseline for developer
  const baseline: LivingBaseline = {
    id: 'baseline-001',
    personId: 'dev-001',
    name: 'Single Person - Urban US',
    currency: 'USD',
    monthlyBreakdown: {
      rent: 1800,
      utilities: 150,
      internetMobile: 100,
      homeInsurance: 50,
      healthExpenses: 300,
      food: 500,
      transportation: 200,
      childcare: 0,
      debtPayments: 200,
      clothing: 100,
      medicine: 50,
      emergencyFundSavings: 300,
      leisureSocial: 200,
      taxesFees: 150
    },
    effectiveFrom: new Date()
  };

  const monthlyRequired = calculator.calculateMonthlyBaseline(baseline);
  console.log(`Monthly Living Cost Required: $${monthlyRequired.toFixed(2)}`);

  // Generate coverage report
  const coverageReport = calculator.generateCoverageReport(
    'dev-001',
    baseline,
    monthlyValuations
  );

  console.log(`\nIncome vs Baseline:`);
  console.log(`  Projected Gross Income: $${coverageReport.projectedGrossIncome.toFixed(2)}`);
  console.log(`  Projected Net Income: $${coverageReport.projectedNetIncome.toFixed(2)}`);
  console.log(`  Required Living Cost: $${coverageReport.requiredLivingCost.toFixed(2)}`);
  console.log(`  Coverage Ratio: ${(coverageReport.coverageRatio * 100).toFixed(1)}%`);
  
  if (coverageReport.shortfall > 0) {
    console.log(`  ⚠️  Shortfall: $${coverageReport.shortfall.toFixed(2)}`);
  } else {
    console.log(`  ✓  Surplus: $${coverageReport.surplus.toFixed(2)}`);
  }

  console.log(`\nCategory Breakdown:`);
  for (const item of coverageReport.breakdown) {
    const status = item.covered ? '✓' : '✗';
    console.log(`  ${status} ${item.category}: $${item.required.toFixed(2)}`);
  }

  // Calculate recommended rate adjustment if needed
  if (coverageReport.shortfall > 0) {
    const adjustment = calculator.calculateRecommendedRateAdjustment(
      coverageReport.projectedNetIncome,
      baseline,
      160 // Assume 160 hours/month
    );

    console.log(`\nRecommended Rate Adjustment:`);
    console.log(`  Current Hourly Equivalent: $${adjustment.currentHourlyEquivalent.toFixed(2)}`);
    console.log(`  Required Hourly Equivalent: $${adjustment.requiredHourlyEquivalent.toFixed(2)}`);
    console.log(`  Adjustment Needed: ${adjustment.adjustmentPercentage > 0 ? '+' : ''}${adjustment.adjustmentPercentage.toFixed(1)}%`);
  }
}

/**
 * Example 3: Payment component calculations
 */
function examplePaymentComponents() {
  console.log('\n=== Example 3: Payment Components ===\n');

  const baseRate = 75.00;
  const baseValue = 300.00;

  // Overtime
  const overtime = PaymentCalculator.calculateOvertime(baseRate, 2, 1.5);
  console.log(`${overtime.description}: $${overtime.amount.toFixed(2)}`);

  // Night differential
  const nightDiff = PaymentCalculator.calculateNightDifferential(baseRate, 3, 0.15);
  console.log(`${nightDiff.description}: $${nightDiff.amount.toFixed(2)}`);

  // Weekend differential
  const weekendDiff = PaymentCalculator.calculateWeekendDifferential(baseRate, 4, 0.20);
  console.log(`${weekendDiff.description}: $${weekendDiff.amount.toFixed(2)}`);

  // Quality bonus
  const qualityBonus = PaymentCalculator.calculateQualityBonus(baseValue, 0.95, 0.90, 0.05);
  if (qualityBonus) {
    console.log(`${qualityBonus.description}: $${qualityBonus.amount.toFixed(2)}`);
  }

  // Milestone bonus
  const milestoneBonus = PaymentCalculator.calculateMilestoneBonus(baseValue, 0.10);
  console.log(`${milestoneBonus.description}: $${milestoneBonus.amount.toFixed(2)}`);

  // Urgency fee
  const urgencyFee = PaymentCalculator.calculateUrgencyFee(baseValue, 'high');
  if (urgencyFee) {
    console.log(`${urgencyFee.description}: $${urgencyFee.amount.toFixed(2)}`);
  }

  // Risk premium
  const riskPremium = PaymentCalculator.calculateRiskPremium(baseValue, 0.8, 0.25);
  console.log(`${riskPremium.description}: $${riskPremium.amount.toFixed(2)}`);

  // On-call pay
  const onCallPay = PaymentCalculator.calculateOnCallPay(baseRate, 24, 0.25);
  console.log(`${onCallPay.description}: $${onCallPay.amount.toFixed(2)}`);

  // Code review allocation
  const codeReview = PaymentCalculator.calculateCodeReviewAllocation(baseRate, 1.5);
  console.log(`${codeReview.description}: $${codeReview.amount.toFixed(2)}`);

  // Scrum ceremonies
  const scrumCeremonies = PaymentCalculator.calculateScrumCeremoniesAllocation(baseRate, 2);
  console.log(`${scrumCeremonies.description}: $${scrumCeremonies.amount.toFixed(2)}`);
}

/**
 * Example 4: Using example configurations
 */
function exampleUsingTemplates() {
  console.log('\n=== Example 4: Using Configuration Templates ===\n');

  console.log('Available Rate Plan Examples:');
  console.log(`  Senior Developer: $${ratePlanExamples.seniorDeveloper.baseRate}/hr`);
  console.log(`  Junior Developer: $${ratePlanExamples.juniorDeveloper.baseRate}/hr`);
  console.log(`  QA Engineer: $${ratePlanExamples.qaEngineer.baseRate}/hr`);
  console.log(`  Scrum Master: $${ratePlanExamples.scrumMaster.baseRate}/hr`);
  console.log(`  Designer: $${ratePlanExamples.designer.baseRate}/hr`);
  console.log(`  DevOps: $${ratePlanExamples.devOps.baseRate}/hr`);

  console.log('\nAvailable Cost Profile Examples:');
  console.log(`  US Standard: ${(costProfileExamples.us.payrollBurdenRate! * 100).toFixed(0)}% burden`);
  console.log(`  UK Standard: ${(costProfileExamples.uk.payrollBurdenRate! * 100).toFixed(0)}% burden`);
  console.log(`  Germany: ${(costProfileExamples.germany.payrollBurdenRate! * 100).toFixed(0)}% burden`);
  console.log(`  Startup Lean: ${(costProfileExamples.startup.payrollBurdenRate! * 100).toFixed(0)}% burden`);
  console.log(`  Enterprise Full: ${(costProfileExamples.enterprise.payrollBurdenRate! * 100).toFixed(0)}% burden`);

  console.log('\nAvailable Living Baseline Examples:');
  
  const examples = [
    { name: 'Single Urban US', baseline: livingBaselineExamples.singleUrban },
    { name: 'Family with Children US', baseline: livingBaselineExamples.familyWithChildren },
    { name: 'Single Rural US', baseline: livingBaselineExamples.singleRural },
    { name: 'Minimal Survival US', baseline: livingBaselineExamples.minimalSurvival },
    { name: 'Comfortable Living US', baseline: livingBaselineExamples.comfortable }
  ];

  for (const example of examples) {
    const total = Object.values(example.baseline.monthlyBreakdown!).reduce((sum, val) => sum + val, 0);
    console.log(`  ${example.name}: ${example.baseline.currency}${total.toFixed(2)}/mo`);
  }
}

/**
 * Run all examples
 */
function runAllExamples() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Task Value Ledger System - Complete Usage Examples      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  // Example 1: Task valuation
  const valuationResult = exampleTaskValuation();

  // Example 2: Living baseline (simulate monthly with multiple tasks)
  const monthlyValuations = Array(20).fill(valuationResult); // Simulate 20 similar tasks
  exampleLivingBaseline(monthlyValuations);

  // Example 3: Payment components
  examplePaymentComponents();

  // Example 4: Templates
  exampleUsingTemplates();

  console.log('\n═══════════════════════════════════════════════════════════\n');
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}

export { runAllExamples };
