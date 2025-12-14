# Task Value Ledger System

A cross-platform task management system with first-class time tracking, role-based valuation, and payroll/budget outputs that reconcile:
- Work performed (time tracking, activity, approvals)
- Agreed compensation structures (rates, bonuses, benefits)
- Minimum viable living cost obligations (rent, utilities, etc.)

## Core Concept

The Task Value Ledger treats each task as an economic event that produces:

1. **Work Evidence**: Timers, activity markers, approval records, estimates vs actual
2. **Economic Outputs**: Task value, pay allocation, employer costs, employee net, monthly affordability baseline

## Key Features

### 1. Comprehensive Payment Types

The system supports over 50 payment types organized into categories:

#### Time-Based Pay
- Hourly, daily, weekly, monthly salary
- Overtime (1.5x/2x)
- Night, weekend, and holiday differentials
- On-call and call-out pay
- Minimum shift pay

#### Task-Based & Performance Pay
- Per-task and per-story-point fees
- Milestone and delivery bonuses
- Quality bonuses
- Rework tracking
- Urgency fees
- Risk premiums
- Specialty premiums

#### Role/Coordination Allocations
- Scrum ceremonies
- Backlog grooming
- Cross-team coordination
- Stakeholder management
- Code review
- QA allocation
- Documentation
- Release management
- Incident postmortems

#### Reimbursements & Allowances
- Travel and accommodation
- Per diem
- Home office stipends
- Internet/phone stipends
- Equipment and tooling
- Education and conference budgets
- Relocation allowances

#### Benefits
- Health, dental, vision insurance
- Pension/retirement contributions
- Life and disability insurance
- Wellness benefits
- PTO accrual
- Sick and parental leave
- Stock options/RSUs

#### Taxes & Statutory Contributions
- Employer payroll taxes
- Employee withholding
- Mandatory pension
- Union fees
- Mandatory insurance schemes

#### Cost Accounting Overhead
- License and SaaS allocations
- Cloud spend
- Hardware depreciation
- Office/seat costs
- Admin/HR/finance overhead
- Legal/compliance overhead
- Contingency reserves
- Warranty reserves

### 2. Role-Based Valuation

Supported roles with customizable weights:
- **Developer/Assignee** (default 70% weight)
- **QA Engineer** (default 15% weight)
- **Reviewer** (default 10% weight)
- **Scrum Master** (default 10% weight)
- **Project Manager** (default 15% weight)
- **Designer** (default 20% weight)
- **Client Approver** (default 0% weight - approval only)
- **Ops/SRE** (default 15% weight)
- **Stakeholder** (default 0% weight - visibility only)

### 3. Valuation Model

The system calculates both compensation and cost:

#### A) Compensation Ledger (What people get paid)
```
LaborValue = TrackedTimeHours × EffectiveHourlyRate × ComplexityMultiplier × QualityMultiplier
```

- **Time tracked**: Precise tracking in seconds
- **Agreed rate**: Hourly/daily/weekly/monthly
- **Complexity multiplier**: 0.8-2.5 based on difficulty
- **Quality multiplier**: 0.8-1.2 based on review scores

#### B) Cost Ledger (What it costs to deliver)
```
EmployerCost = GrossPay × (1 + PayrollBurdenRate) + ToolingAllocation + OverheadAllocation + Contingency
```

Includes:
- Direct labor
- Employer overhead (taxes, benefits)
- Tools and licenses
- Contingency and warranty reserves

### 4. Living Cost Baseline

The "socialnorm baseline" tracks 14 categories of living expenses:

**Fixed Essentials:**
- Rent/mortgage
- Utilities
- Internet/mobile
- Home insurance

**Variable Essentials:**
- Food/groceries
- Transportation
- Health expenses
- Medicine

**Stability:**
- Emergency fund savings
- Debt payments

**Participation:**
- Clothing/household goods
- Leisure/social participation
- Childcare (if applicable)
- Taxes/fees

**Coverage Metrics:**
- Monthly required vs projected net pay
- Coverage ratio (projected/required)
- Shortfall or surplus amount
- Category-by-category breakdown

## Architecture

### Core Entities

```typescript
Workspace → Project → Board → List → Card
                                        ↓
                              TaskLedgerEntry
                                        ↓
                              ValuationResult
```

### Data Flow

1. **Task Creation**: Define type, priority, complexity, estimate, acceptance criteria
2. **Assignment & Role Allocation**: Assign participants with roles and weights
3. **Time Tracking**: Track time per participant with timers and activity markers
4. **Review & Acceptance**: Capture quality scores and approvals
5. **Ledger Posting**: Lock time + value (immutable audit trail)
6. **Valuation**: Calculate payouts and costs
7. **Payout/Reporting**: Generate payment schedules and coverage reports

## Usage Examples

### Basic Task Valuation

```typescript
import { TaskValuationEngine, TaskLedgerEntry, RatePlan, CostProfile } from '@payments/task-value-ledger';

// Create engine
const engine = new TaskValuationEngine();

// Define rate plans for participants
const ratePlans = new Map<string, RatePlan>();
ratePlans.set('dev-001', {
  id: 'rate-001',
  personId: 'dev-001',
  workspaceId: 'ws-001',
  type: 'hourly',
  baseRate: 75.00,
  currency: 'USD',
  effectiveFrom: new Date(),
  overtimeMultiplier: 1.5
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

// Create task ledger entry
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
  isLocked: true,
  valuationResult: null as any // Will be calculated
};

// Calculate valuation
const result = engine.calculateTaskValuation(ledgerEntry, ratePlans, costProfile);

console.log(`Total Labor Value: $${result.totalLaborValue.toFixed(2)}`);
console.log(`Total Employer Cost: $${result.totalEmployerCost.toFixed(2)}`);
```

### Living Baseline Coverage

```typescript
import { LivingBaselineCalculator, LivingBaseline } from '@payments/task-value-ledger';

const calculator = new LivingBaselineCalculator();

// Define living baseline
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

// Calculate monthly baseline
const monthlyRequired = calculator.calculateMonthlyBaseline(baseline);
console.log(`Monthly Required: $${monthlyRequired.toFixed(2)}`);

// Generate coverage report
const monthlyValuations = [result]; // From previous example
const coverageReport = calculator.generateCoverageReport(
  'dev-001',
  baseline,
  monthlyValuations
);

console.log(`Coverage Ratio: ${(coverageReport.coverageRatio * 100).toFixed(1)}%`);
if (coverageReport.shortfall > 0) {
  console.log(`Shortfall: $${coverageReport.shortfall.toFixed(2)}`);
} else {
  console.log(`Surplus: $${coverageReport.surplus.toFixed(2)}`);
}
```

### Payment Component Calculations

```typescript
import { PaymentCalculator, PaymentType } from '@payments/task-value-ledger';

// Calculate overtime
const overtime = PaymentCalculator.calculateOvertime(75, 2, 1.5);
console.log(`${overtime.description}: $${overtime.amount.toFixed(2)}`);

// Calculate quality bonus
const qualityBonus = PaymentCalculator.calculateQualityBonus(300, 0.95, 0.90, 0.05);
if (qualityBonus) {
  console.log(`${qualityBonus.description}: $${qualityBonus.amount.toFixed(2)}`);
}

// Calculate risk premium
const riskPremium = PaymentCalculator.calculateRiskPremium(300, 0.8, 0.25);
console.log(`${riskPremium.description}: $${riskPremium.amount.toFixed(2)}`);
```

## Configuration

### Rate Plan Configuration

Rate plans can be configured per person and workspace with different types:

- **Hourly**: Direct hourly rate
- **Daily**: Rate per 8-hour day
- **Weekly**: Rate per 40-hour week
- **Monthly Salary**: Fixed monthly amount (divided by 160 hours)

Each rate plan supports:
- Overtime multipliers
- Night differentials
- Weekend differentials
- Holiday differentials

### Cost Profile Configuration

Cost profiles are configured per workspace and country:

- **Payroll Burden Rate**: Employer taxes and benefits (typically 20-40%)
- **Tooling Cost**: Monthly SaaS and tool costs
- **Overhead Allocation**: Admin, HR, legal, office costs (typically 15-35%)
- **Contingency Rate**: Risk buffer (typically 5-15%)

### Valuation Configuration

The valuation engine can be configured:

```typescript
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

## Example Configurations

The system includes example configurations for common scenarios:

### Rate Plans
- Hourly contractor ($75/hr)
- Daily consultant ($600/day)
- Monthly salaried ($8000/mo)
- Senior developer ($125/hr)
- Junior developer ($45/hr)
- QA engineer ($55/hr)
- Scrum Master ($85/hr)
- Designer ($95/hr)
- DevOps/SRE ($110/hr)

### Cost Profiles
- US standard (30% burden)
- UK standard (27% burden)
- Germany (40% burden)
- India (20% burden)
- Startup lean (25% burden, low overhead)
- Enterprise full (35% burden, high overhead)
- Remote contractor (10% burden)

### Living Baselines
- Single urban US ($4,100/mo)
- Family with children US ($8,400/mo)
- Single rural US ($2,735/mo)
- Single London UK (£3,310/mo)
- Single Berlin Germany (€2,600/mo)
- Single Bangalore India (₹71,000/mo)
- Minimal survival US ($1,955/mo)
- Comfortable living US ($6,805/mo)

## Implementation Considerations

### MVP Scope

**Phase 1 (Core):**
- Board/card/task management
- Time tracking per user
- Estimates vs actual
- Role allocation
- Hourly/daily/monthly rates
- Task value rollups
- Monthly net vs baseline reports

**Phase 2 (Advanced):**
- End-of-day payouts
- Invoicing and client billing
- Country-specific tax templates
- Automation rules
- Multi-currency support
- Advanced payment policies

### Compliance & Legal

When implementing payouts:
- Ensure compliance with local employment law
- Consider payroll regulations for daily/weekly payments
- Structure as employer-run payroll, earned wage access partner, or contractor invoicing
- Maintain audit trails with immutable ledger entries
- Implement proper approval workflows

### Privacy

- Keep activity tracking minimal
- Focus on timer data + optional notes
- Respect user privacy
- Make tracking opt-in where possible
- Provide transparency into what's tracked

### Security

- Use immutable ledger entries for audit trails
- Implement proper authentication and authorization
- Encrypt sensitive financial data
- Maintain change history for disputes
- Consider digital signatures for locked entries

## API Design (Future)

The system is designed to support a REST API with endpoints for:

- **Workspaces**: CRUD operations
- **Projects/Boards/Lists/Cards**: Full Trello-like management
- **Time Tracking**: Start/stop timers, log time entries
- **Rate Plans**: Configure and manage rates
- **Cost Profiles**: Configure employer cost structures
- **Living Baselines**: Define and track living cost requirements
- **Valuation**: Calculate task values and generate reports
- **Reports**: Coverage reports, cost breakdowns, payment schedules

## Technology Stack (Recommended)

- **Backend**: Node.js/TypeScript with event-sourced ledger
- **Frontend**: React Native (iOS/Android) + Electron/Tauri (desktop) or Flutter
- **Database**: PostgreSQL for relational queries + append-only event store
- **Time Sync**: Local-first queue with conflict resolution
- **Real-time**: WebSocket for live timer updates

## License

MIT

## Contributing

Contributions are welcome! Please ensure:
- All new payment types are properly typed
- Calculation engines maintain precision
- Tests cover edge cases
- Documentation is updated

## Support

For issues, questions, or feature requests, please file an issue on GitHub.
