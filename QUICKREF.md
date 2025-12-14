# Quick Reference Guide

## Installation

```bash
npm install
npm run build
```

## Run Examples

```bash
node dist/examples.js
```

## Basic Usage

### 1. Calculate Task Valuation

```typescript
import { TaskValuationEngine, TaskLedgerEntry, RatePlan, CostProfile } from '@payments/task-value-ledger';

// Create engine
const engine = new TaskValuationEngine();

// Define rate plans
const ratePlans = new Map<string, RatePlan>();
ratePlans.set('dev-001', {
  id: 'rate-001',
  personId: 'dev-001',
  workspaceId: 'ws-001',
  type: 'hourly',
  baseRate: 75.00,
  currency: 'USD',
  effectiveFrom: new Date()
});

// Define cost profile
const costProfile: CostProfile = {
  id: 'cost-001',
  workspaceId: 'ws-001',
  country: 'US',
  name: 'US Standard',
  payrollBurdenRate: 0.30,
  toolingCostPerMonth: 500,
  overheadAllocationRate: 0.25,
  contingencyRate: 0.10,
  currency: 'USD'
};

// Create ledger entry
const ledgerEntry: TaskLedgerEntry = {
  id: 'entry-001',
  cardId: 'card-001',
  workspaceId: 'ws-001',
  projectId: 'proj-001',
  participants: [{
    personId: 'dev-001',
    roleType: 'developer',
    weight: 1.0,
    trackedTimeSeconds: 14400 // 4 hours
  }],
  timeEntries: ['time-001'],
  actualHours: 4,
  complexity: 1.5,
  qualityScore: 0.95,
  postedAt: new Date(),
  isLocked: true
};

// Calculate
const result = engine.calculateTaskValuation(ledgerEntry, ratePlans, costProfile);
console.log(`Labor Value: $${result.totalLaborValue.toFixed(2)}`);
console.log(`Employer Cost: $${result.totalEmployerCost.toFixed(2)}`);
```

### 2. Check Living Baseline Coverage

```typescript
import { LivingBaselineCalculator, LivingBaseline } from '@payments/task-value-ledger';

const calculator = new LivingBaselineCalculator();

const baseline: LivingBaseline = {
  id: 'baseline-001',
  personId: 'dev-001',
  name: 'Urban Single Person',
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

// Calculate monthly requirement
const monthlyRequired = calculator.calculateMonthlyBaseline(baseline);
console.log(`Required: $${monthlyRequired.toFixed(2)}`);

// Generate coverage report
const coverageReport = calculator.generateCoverageReport(
  'dev-001',
  baseline,
  monthlyValuations
);

console.log(`Coverage: ${(coverageReport.coverageRatio * 100).toFixed(1)}%`);
if (coverageReport.shortfall > 0) {
  console.log(`Shortfall: $${coverageReport.shortfall.toFixed(2)}`);
}
```

### 3. Calculate Payment Components

```typescript
import { PaymentCalculator } from '@payments/task-value-ledger';

// Overtime
const overtime = PaymentCalculator.calculateOvertime(75, 2, 1.5);
// Result: $225.00 (2 hours at 1.5x)

// Quality bonus
const bonus = PaymentCalculator.calculateQualityBonus(300, 0.95, 0.90, 0.05);
// Result: $15.00 (5% bonus for 95% quality)

// Night differential
const nightDiff = PaymentCalculator.calculateNightDifferential(75, 3, 0.15);
// Result: $33.75 (15% extra for 3 hours)

// On-call pay
const onCall = PaymentCalculator.calculateOnCallPay(75, 24, 0.25);
// Result: $450.00 (25% of base for 24 hours standby)
```

### 4. Use Example Templates

```typescript
import { ratePlanExamples, costProfileExamples, livingBaselineExamples } from '@payments/task-value-ledger';

// Use a predefined rate plan
const seniorDevRate = {
  ...ratePlanExamples.seniorDeveloper,
  personId: 'dev-001',
  workspaceId: 'ws-001',
  id: 'rate-001',
  effectiveFrom: new Date()
};

// Use a predefined cost profile
const usCostProfile = {
  ...costProfileExamples.us,
  id: 'cost-001',
  workspaceId: 'ws-001'
};

// Use a predefined living baseline
const urbanBaseline = {
  ...livingBaselineExamples.singleUrban,
  id: 'baseline-001',
  personId: 'dev-001',
  effectiveFrom: new Date()
};
```

## Key Constants

### Rate Plan Types
- `'hourly'`: Direct hourly rate
- `'daily'`: Rate per 8-hour day
- `'weekly'`: Rate per 40-hour week
- `'monthly_salary'`: Fixed monthly (divided by 160 hours)

### Role Types
- `'developer'`: Primary implementation (70% weight)
- `'qa'`: Testing and quality (15% weight)
- `'reviewer'`: Code review (10% weight)
- `'scrum_master'`: Facilitation (10% weight)
- `'project_manager'`: Planning (15% weight)
- `'designer'`: UI/UX design (20% weight)
- `'ops_sre'`: Operations (15% weight)
- `'client_approver'`: Approval only (0% weight)
- `'stakeholder'`: Visibility only (0% weight)

### Multiplier Ranges
- **Complexity**: 0.8 - 2.5
- **Quality**: 0.8 - 1.2

### Quality Bonus Threshold
- **≥ 0.90** (90%): Automatic 5% bonus

## Configuration

### Valuation Engine Config

```typescript
import { TaskValuationEngine, ValuationConfig } from '@payments/task-value-ledger';

const config: ValuationConfig = {
  applyComplexityMultiplier: true,
  applyQualityMultiplier: true,
  applyEstimateVariance: false,
  minQualityMultiplier: 0.8,
  maxQualityMultiplier: 1.2,
  minComplexityMultiplier: 0.8,
  maxComplexityMultiplier: 2.5
};

const engine = new TaskValuationEngine(config);
```

### Default Role Weights

```typescript
import { TaskValuationEngine, RoleType } from '@payments/task-value-ledger';

const devWeight = TaskValuationEngine.getDefaultRoleWeight(RoleType.DEVELOPER);
// Returns: 0.70 (70%)

const qaWeight = TaskValuationEngine.getDefaultRoleWeight(RoleType.QA);
// Returns: 0.15 (15%)
```

## Common Formulas

### Base Pay Calculation
```
Base Pay = Hours × Rate
```

### Adjusted Pay Calculation
```
Adjusted Pay = Base Pay × Complexity Multiplier × Quality Multiplier
```

### Gross Pay with Bonuses
```
Gross Pay = Adjusted Pay + Bonuses - Penalties
```

### Employer Cost Calculation
```
Direct Labor = Sum(Gross Pay for all participants)
Payroll Burden = Direct Labor × Burden Rate
Tooling = Tooling Cost per Month / 160
Overhead = Direct Labor × Overhead Rate
Contingency = (Labor + Burden + Overhead) × Contingency Rate
Total Cost = Labor + Burden + Tooling + Overhead + Contingency
```

### Coverage Ratio
```
Coverage Ratio = Projected Net Income / Required Living Cost
```

### Rate Adjustment Needed
```
Required Rate = (Required Living Cost × Hours per Month) / Current Hours
Adjustment % = ((Required Rate - Current Rate) / Current Rate) × 100
```

## Payment Type Categories

### Time-Based (11 types)
- Hourly, daily, weekly, monthly salary
- Overtime, night/weekend/holiday differentials
- On-call, call-out, minimum shift pay

### Task-Based (9 types)
- Per-task fee, per-story-point fee
- Milestone, delivery, quality bonuses
- Rework penalty, urgency fee, risk premium, specialty premium

### Role/Coordination (9 types)
- Scrum ceremonies, backlog grooming
- Cross-team coordination, stakeholder management
- Code review, QA, documentation
- Release management, incident postmortem

### Reimbursements (10 types)
- Travel, per diem, accommodation
- Home office, internet/phone, equipment, tooling
- Education, conference, relocation

### Benefits (10 types)
- Health, dental, vision insurance
- Pension, life, disability insurance
- Wellness, PTO, sick pay, parental leave, stock options

### Taxes (5 types)
- Employer payroll tax, employee withholding
- Mandatory pension, union fees, mandatory insurance

### Cost Overhead (8 types)
- License, cloud, hardware allocations
- Office seat cost, admin overhead
- Legal/compliance, contingency, warranty reserves

### Cashflow (5 types)
- Advance fee, subscription fee, transaction fee
- FX fee, chargeback reserve

## Documentation

- **DESIGN.md**: System architecture and design
- **API.md**: REST API specification
- **WORKFLOWS.md**: Process workflows
- **SUMMARY.md**: Implementation overview
- **README.md**: Getting started

## Example Scenarios

### Scenario 1: Solo Developer Task
```typescript
// 4 hours of work, medium complexity, excellent quality
participants: [{ personId: 'dev-001', roleType: 'developer', weight: 1.0, trackedTimeSeconds: 14400 }]
complexity: 1.2
qualityScore: 0.95
// Result: Higher pay due to quality bonus
```

### Scenario 2: Team Collaboration
```typescript
// Multiple roles on same task
participants: [
  { personId: 'dev-001', roleType: 'developer', weight: 0.70, trackedTimeSeconds: 14400 },
  { personId: 'qa-001', roleType: 'qa', weight: 0.15, trackedTimeSeconds: 5400 },
  { personId: 'rev-001', roleType: 'reviewer', weight: 0.15, trackedTimeSeconds: 1800 }
]
// Result: Value distributed based on weights
```

### Scenario 3: Complex High-Risk Task
```typescript
// Difficult production deployment
complexity: 2.3 // High complexity
qualityScore: 0.88 // Good quality
// Add risk premium manually
const riskPremium = PaymentCalculator.calculateRiskPremium(baseValue, 0.8, 0.25);
// Result: Significantly higher pay due to complexity and risk
```

## Troubleshooting

### Issue: Rate calculation seems wrong
**Solution**: Check rate plan type and verify hours conversion
- Hourly: Direct rate
- Daily: Rate / 8 hours
- Weekly: Rate / 40 hours
- Monthly: Rate / 160 hours

### Issue: Quality bonus not applied
**Solution**: Ensure `qualityScore >= 0.90` (90% threshold)

### Issue: Living baseline shows shortfall
**Solution**: Use `calculateRecommendedRateAdjustment()` to see required rate increase

### Issue: Cost seems high
**Solution**: Check cost profile burden and overhead rates:
- US Standard: 30% burden, 25% overhead
- Enterprise: 35% burden, 35% overhead
- Startup: 25% burden, 15% overhead

## Best Practices

1. **Always lock ledger entries** after posting (set `isLocked: true`)
2. **Track time per role** if person works in multiple capacities
3. **Set realistic complexity multipliers** (1.0 is baseline, 2.0+ is exceptional)
4. **Review quality scores** before finalizing to ensure fairness
5. **Update living baselines quarterly** or after major life changes
6. **Use example templates** as starting points, then customize
7. **Keep audit trails** by never modifying locked ledger entries
8. **Document payment policies** in YAML configuration files

## Support

For issues or questions:
1. Check DESIGN.md for architectural details
2. Review WORKFLOWS.md for process guidance
3. See API.md for future API integration
4. Run examples.ts for working demonstrations
