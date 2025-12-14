# Task Value Ledger - Workflows

This document describes the key workflows in the Task Value Ledger system.

## Table of Contents

1. [Task Creation and Assignment](#task-creation-and-assignment)
2. [Time Tracking](#time-tracking)
3. [Task Review and Approval](#task-review-and-approval)
4. [Ledger Posting and Valuation](#ledger-posting-and-valuation)
5. [Monthly Reporting](#monthly-reporting)
6. [Rate Plan Management](#rate-plan-management)
7. [Living Baseline Tracking](#living-baseline-tracking)

---

## Task Creation and Assignment

### Workflow Steps

1. **Create Task**
   - User creates a card in a board list
   - Specifies: title, description, type, priority
   - Sets complexity (0.8 - 2.5)
   - Provides estimate in hours
   - Adds acceptance criteria
   - Tags for categorization

2. **Assign Participants**
   - Add team members with roles
   - Set weight for each participant
   - Weights determine value distribution
   - Default weights from role configuration

3. **Task Ready**
   - Task appears in assigned users' work queues
   - Ready for time tracking

### Example

```
Task: "Implement OAuth2 authentication"
Type: Feature
Priority: High
Complexity: 1.8
Estimate: 12 hours

Participants:
- Alice (Developer, 70% weight)
- Bob (QA, 20% weight)
- Carol (Reviewer, 10% weight)

Acceptance Criteria:
- Google login works
- GitHub login works
- Session persists 30 days
- All tests pass
```

---

## Time Tracking

### Local-First Timer Workflow

1. **Start Timer**
   - User clicks "Start" on task
   - Timer runs locally
   - Syncs to server periodically
   - Resilient to offline periods

2. **Track Work**
   - Timer runs while working
   - Can pause and resume
   - Optional activity markers
   - Privacy-respecting (minimal tracking)

3. **Stop Timer**
   - User clicks "Stop"
   - Final sync to server
   - Time entry locked
   - Associated with role and task

### Manual Time Entry

For non-timer work:
1. Select task
2. Choose role
3. Enter start/end time
4. Add notes
5. Submit

### Multi-Role Time Tracking

Same person can track time in different roles:
- 4 hours as Developer
- 1 hour as Reviewer
- 0.5 hours in Scrum ceremonies

Each role gets separate time entries.

---

## Task Review and Approval

### Quality Assessment Workflow

1. **Self-Assessment**
   - Developer marks task complete
   - Provides initial quality estimate
   - Notes any issues or concerns

2. **Code Review**
   - Reviewer examines code
   - Tracks review time
   - Provides review score (0.0 - 1.0)
   - Comments on quality

3. **QA Testing**
   - QA runs test suite
   - Manual testing if needed
   - Tracks testing time
   - Reports defects or approves

4. **Final Approval**
   - PM or client approves
   - Quality score finalized
   - Task ready for ledger posting

### Quality Scoring

Quality score affects payout multiplier:
- 1.0 (perfect) → 1.2x multiplier
- 0.9 (excellent) → 1.18x multiplier + 5% bonus
- 0.75 (good) → 1.0x multiplier
- 0.5 (acceptable) → 0.9x multiplier
- < 0.5 (poor) → 0.8x multiplier

---

## Ledger Posting and Valuation

### Posting Workflow

1. **Pre-Posting Validation**
   - Check all time entries present
   - Verify approval obtained
   - Confirm quality score set
   - Preview valuation

2. **Post to Ledger**
   - Lock all data (immutable)
   - Calculate final valuation
   - Generate ledger entry
   - Distribute to participants

3. **Valuation Calculation**
   
   For each participant:
   ```
   Base Pay = Hours × Rate
   Adjusted Pay = Base Pay × Complexity × Quality
   Gross Pay = Adjusted Pay + Bonuses
   ```

   Employer Cost:
   ```
   Direct Labor = Sum(Gross Pay)
   Payroll Burden = Direct Labor × Burden Rate
   Tooling = Tooling Cost / Hours per Month
   Overhead = Direct Labor × Overhead Rate
   Contingency = (Labor + Burden + Overhead) × Contingency Rate
   Total Cost = Labor + Burden + Tooling + Overhead + Contingency
   ```

4. **Audit Trail**
   - Ledger entry ID generated
   - Timestamp recorded
   - Approver documented
   - Changes prohibited (immutable)

### Example Valuation

```
Task: OAuth2 Implementation
Total Hours: 14.5
Complexity: 1.8
Quality: 0.95

Participant: Alice (Developer)
- Hours: 10
- Rate: $75/hr
- Base: $750
- × Complexity (1.8): $1,350
- × Quality (1.18): $1,593
- + Quality Bonus (5%): $79.65
- Gross Pay: $1,672.65

Participant: Bob (QA)
- Hours: 3
- Rate: $55/hr
- Base: $165
- × Complexity (1.8): $297
- × Quality (1.18): $350.46
- + Quality Bonus (5%): $17.52
- Gross Pay: $367.98

Participant: Carol (Reviewer)
- Hours: 1.5
- Rate: $85/hr
- Base: $127.50
- × Complexity (1.8): $229.50
- × Quality (1.18): $270.81
- + Quality Bonus (5%): $13.54
- Gross Pay: $284.35

Total Labor Value: $2,324.98

Employer Cost Breakdown:
- Direct Labor: $2,324.98
- Payroll Burden (30%): $697.49
- Tooling: $43.75
- Overhead (25%): $581.25
- Contingency (10%): $364.75
- Total Cost: $4,012.22
```

---

## Monthly Reporting

### Month-End Process

1. **Collect Data**
   - Gather all ledger entries for month
   - Sum by person, project, role
   - Calculate totals

2. **Generate Reports**
   
   **For Employees:**
   - Gross earnings
   - Hours worked
   - Breakdown by project
   - Breakdown by payment type
   - Living baseline coverage

   **For Projects:**
   - Total cost
   - Cost breakdown
   - Hours by role
   - Variance vs budget

   **For Company:**
   - Total payroll
   - Total employer cost
   - Overhead analysis
   - Project profitability

3. **Living Baseline Analysis**
   - Compare earnings to baseline
   - Flag shortfalls
   - Recommend rate adjustments
   - Track trends over time

4. **Export and Distribute**
   - PDF reports for employees
   - CSV for accounting systems
   - JSON for integrations
   - Dashboard views

### Coverage Report Example

```
Employee: Alice Johnson
Month: January 2024

Earnings:
- Gross Income: $11,151.00
- Estimated Net: $8,363.25

Living Baseline: $4,100.00

Coverage: 204% ✓
Surplus: $4,263.25

Category Breakdown:
✓ Rent/Mortgage: $1,800 (covered)
✓ Utilities: $150 (covered)
✓ Food: $500 (covered)
✓ Transportation: $200 (covered)
✓ Health: $300 (covered)
✓ Emergency Fund: $300 (covered)
... (all categories covered)

Status: Comfortable Living Achieved
Recommendation: Maintain current rate
```

---

## Rate Plan Management

### Setting Up Rate Plans

1. **Choose Rate Type**
   - Hourly: Direct per-hour rate
   - Daily: Rate per 8-hour day
   - Weekly: Rate per 40-hour week
   - Monthly: Fixed monthly salary

2. **Set Base Rate**
   - Primary compensation amount
   - In workspace currency

3. **Configure Differentials**
   - Overtime multiplier (e.g., 1.5x)
   - Night differential (e.g., 15%)
   - Weekend differential (e.g., 20%)
   - Holiday differential (e.g., 2.0x)

4. **Set Effective Dates**
   - Effective from date
   - Optional effective to date
   - Supports rate changes over time

### Rate Change Workflow

1. **Plan Rate Change**
   - Discuss with employee
   - Determine new rate
   - Set effective date

2. **Create New Rate Plan**
   - Enter new rate
   - Set effective from = change date
   - Previous plan auto-expires

3. **System Behavior**
   - Uses correct rate based on task date
   - Historical data unchanged
   - Future tasks use new rate
   - Reports show rate transitions

### Example Rate History

```
Alice Johnson - Rate History

2024-01-01 to 2024-06-30:
  Type: Hourly
  Rate: $75/hr
  Total Earned: $60,000

2024-07-01 to present:
  Type: Hourly
  Rate: $85/hr (13.3% increase)
  Total Earned: $34,000

Performance Review: June 2024
Reason: Excellent quality scores, leadership
```

---

## Living Baseline Tracking

### Initial Setup

1. **Assess Living Costs**
   - Rent/mortgage
   - Utilities
   - Transportation
   - Food
   - Healthcare
   - Debt obligations
   - Savings goals
   - Discretionary spending

2. **Create Baseline**
   - Enter monthly amounts per category
   - Total calculated automatically
   - Set currency
   - Set effective date

3. **Set Review Cadence**
   - Quarterly review recommended
   - Annual update required
   - Ad-hoc for major life changes

### Ongoing Monitoring

1. **Monthly Comparison**
   - Actual earnings vs baseline
   - Coverage ratio calculated
   - Shortfall or surplus identified
   - Trend analysis

2. **Coverage Analysis**
   - Which categories are covered?
   - Is emergency fund being built?
   - Is discretionary spending achievable?
   - Long-term sustainability?

3. **Rate Negotiation Support**
   - Show gap to employer/client
   - Calculate required rate increase
   - Justify with living cost data
   - Support fair compensation

### Life Event Updates

Trigger baseline review when:
- Change in rent/mortgage
- New dependent (child, parent)
- Change in health insurance
- Car purchase/loan
- Student loan changes
- Relocation
- Lifestyle changes

### Example Baseline Update

```
Previous: Single Person - Urban
Monthly: $4,100

Life Event: Had a baby

Updated: Family with One Child
Monthly: $6,400

Increase: $2,300 (56%)

Required Rate Adjustment:
Current: $75/hr (160 hrs/mo = $12,000 gross)
Required: $95/hr (to maintain coverage)
Increase: 26.7%

Next Steps:
1. Discuss with employer
2. Show baseline documentation
3. Negotiate rate increase
4. Update rate plan if approved
```

---

## End-of-Day Payment Workflow (Future)

*This feature is planned for V2*

### Daily Settlement Process

1. **Accrue Earnings**
   - Tasks posted during day
   - Earnings calculated
   - Accumulate in daily balance

2. **End-of-Day Cutoff**
   - Daily cutoff time (e.g., 11:59 PM)
   - Calculate total earned
   - Subtract any fees/advances

3. **Initiate Payout**
   - Transfer to bank account
   - Or load to debit card
   - Or credit to wallet

4. **Settlement Options**
   - Next-day settlement (free)
   - Same-day settlement (fee)
   - Weekly settlement (free)
   - Monthly settlement (standard)

### Subscription Tiers

**Basic (Free):**
- Monthly settlement
- Manual time entry
- Basic reports

**Pro ($19/mo):**
- Daily settlement
- Auto-timer
- Advanced reports
- Living baseline tracking

**Enterprise (Custom):**
- Real-time settlement
- Multi-entity billing
- API access
- Compliance features
- Dedicated support

---

## Automation Rules (Future)

### Auto-Add Overhead

When task created in Agile project:
- Auto-add 0.5h Scrum Master time
- For ceremonies overhead

### Auto-Add Review

When task marked "Ready for Review":
- Auto-add 0.25h Reviewer time
- For code review allocation

### Flag Overruns

When actual > estimate × 1.5:
- Flag task for review
- Don't penalize pay
- Learn from variance
- Improve estimates

### Quality Bonuses

When quality score ≥ 0.9:
- Auto-apply 5% bonus
- Recognize excellent work
- Incentivize quality

---

## Dispute Resolution

### Dispute Process

1. **Identify Issue**
   - Time entry disputed
   - Quality score disagreement
   - Rate calculation question
   - Approval status unclear

2. **Review Audit Trail**
   - Check immutable ledger
   - View time entry details
   - See approval history
   - Examine calculations

3. **Discuss with Parties**
   - Worker and approver
   - Review evidence
   - Clarify expectations
   - Seek resolution

4. **Adjust if Needed**
   - If error found: create adjustment entry
   - Document reason
   - Credit or debit as needed
   - Update future policy if systemic

5. **Record Resolution**
   - Note in task comments
   - Update documentation
   - Prevent future issues
   - Maintain trust

---

## Best Practices

### For Workers

1. **Track time accurately**
   - Start timer when starting work
   - Stop when taking breaks
   - Log time same day
   - Add helpful notes

2. **Communicate proactively**
   - Flag blockers early
   - Update estimates if needed
   - Request help when stuck
   - Provide context in notes

3. **Maintain quality**
   - Review your own work first
   - Run tests before submitting
   - Document your changes
   - Aim for high quality scores

4. **Update baseline regularly**
   - Review quarterly
   - Update for life changes
   - Use in rate negotiations
   - Plan financial goals

### For Managers

1. **Set clear expectations**
   - Define quality standards
   - Provide estimate guidance
   - Clarify acceptance criteria
   - Establish review process

2. **Review regularly**
   - Check time entries weekly
   - Approve completed tasks promptly
   - Provide feedback on quality
   - Address issues quickly

3. **Support team members**
   - Review coverage reports
   - Discuss baseline needs
   - Advocate for fair rates
   - Recognize good work

4. **Monitor costs**
   - Review project costs monthly
   - Track vs budget
   - Identify trends
   - Optimize allocation

### For Organizations

1. **Configure thoughtfully**
   - Set appropriate cost profiles
   - Define clear role weights
   - Establish payment policies
   - Document expectations

2. **Maintain compliance**
   - Follow employment law
   - Keep audit trails
   - Respect privacy
   - Secure data

3. **Foster transparency**
   - Share how pay is calculated
   - Explain quality metrics
   - Publish rate bands
   - Communicate changes

4. **Continuous improvement**
   - Gather feedback
   - Refine processes
   - Update configurations
   - Learn from data
