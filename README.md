# .payments - Task Value Ledger System

A comprehensive cross-platform task management system with first-class time tracking, role-based valuation, and payroll/budget outputs.

## What is it?

The Task Value Ledger transforms task management from simple "done/not done" tracking into a complete economic system that:

- **Tracks work**: Time tracking, activity markers, estimates vs actual
- **Calculates value**: Role-based compensation with complexity and quality multipliers
- **Computes costs**: Full employer cost modeling (taxes, benefits, overhead, contingency)
- **Ensures adequacy**: Compares income against living cost baselines ("socialnorm packages")

## Key Features

### 🎯 Comprehensive Payment Types (50+)
- Time-based pay (hourly, daily, overtime, differentials)
- Task-based and performance pay (bonuses, milestones, quality)
- Role/coordination allocations (scrum ceremonies, code review, QA)
- Reimbursements (travel, equipment, stipends)
- Benefits tracking (insurance, PTO, pension)
- Tax and statutory contributions
- Cost accounting overhead

### 👥 Role-Based Valuation
Multi-role task participation with configurable weights:
- Developer/Assignee (70%)
- QA Engineer (15%)
- Reviewer (10%)
- Scrum Master (10%)
- Project Manager (15%)
- Designer (20%)
- Ops/SRE (15%)
- Client Approver, Stakeholder

### 💰 Dual Ledger System

**Compensation Ledger** (what people earn):
```
Pay = Hours × Rate × Complexity × Quality
```

**Cost Ledger** (what it costs):
```
Cost = Labor + Payroll Burden + Tools + Overhead + Contingency
```

### 🏠 Living Cost Baseline
Track and compare income against 14 categories of living expenses:
- Fixed essentials (rent, utilities, insurance)
- Variable essentials (food, transport, health)
- Stability buffers (savings, emergency fund)
- Participation (leisure, social, childcare)

Get coverage metrics:
- Coverage ratio (projected/required)
- Shortfall or surplus amounts
- Category-by-category breakdown

## Quick Start

```bash
npm install
npm run build
```

## Usage Example

```typescript
import { 
  TaskValuationEngine, 
  LivingBaselineCalculator,
  ratePlanExamples,
  costProfileExamples,
  livingBaselineExamples
} from '@payments/task-value-ledger';

// Create valuation engine
const engine = new TaskValuationEngine();

// Calculate task value
const result = engine.calculateTaskValuation(
  ledgerEntry,
  ratePlans,
  costProfile
);

console.log(`Labor Value: $${result.totalLaborValue}`);
console.log(`Employer Cost: $${result.totalEmployerCost}`);

// Check living cost coverage
const calculator = new LivingBaselineCalculator();
const coverage = calculator.generateCoverageReport(
  personId,
  baseline,
  monthlyValuations
);

console.log(`Coverage: ${(coverage.coverageRatio * 100).toFixed(1)}%`);
```

## Documentation

See [DESIGN.md](./DESIGN.md) for complete system design, architecture, and detailed examples.

## Project Structure

```
src/
├── types/          # Core entity type definitions
├── engine/         # Valuation and calculation engines
├── utils/          # Payment calculation utilities
└── models/         # Example configurations
```

## Example Configurations Included

### Rate Plans
- Hourly contractor, daily consultant, monthly salaried
- Senior/junior developers, QA, Scrum Master, Designer, DevOps

### Cost Profiles
- US, UK, Germany, India
- Startup lean, Enterprise full, Remote contractor

### Living Baselines
- Single urban/rural (US)
- Family with children (US)
- International (London, Berlin, Bangalore)
- Minimal survival to comfortable living

## Roadmap

**Current (MVP):**
- ✅ Core entity types
- ✅ Task valuation engine
- ✅ Living baseline calculator
- ✅ Payment component catalog
- ✅ Example configurations

**Next:**
- [ ] REST API endpoints
- [ ] Time tracking implementation
- [ ] Board/card management UI
- [ ] Report generation
- [ ] Database persistence
- [ ] End-of-day payout integration
- [ ] Multi-currency support

## License

MIT

## Contributing

Contributions welcome! This system is designed to be modular and extensible:
- Add new payment types
- Create country-specific cost profiles
- Build domain-specific valuation policies
- Extend living baseline categories
