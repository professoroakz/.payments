/**
 * Core entity types for the Task Value Ledger system
 */

export interface Workspace {
  id: string;
  name: string;
  type: 'company' | 'client' | 'personal';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface List {
  id: string;
  boardId: string;
  name: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: string;
  listId: string;
  title: string;
  description?: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: number; // 0.8 - 2.5
  estimatedHours?: number;
  position: number;
  tags: string[];
  acceptanceCriteria?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  workspaceIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum RoleType {
  DEVELOPER = 'developer',
  ASSIGNEE = 'assignee',
  SCRUM_MASTER = 'scrum_master',
  PROJECT_MANAGER = 'project_manager',
  QA = 'qa',
  REVIEWER = 'reviewer',
  DESIGNER = 'designer',
  CLIENT_APPROVER = 'client_approver',
  OPS_SRE = 'ops_sre',
  STAKEHOLDER = 'stakeholder'
}

export interface Role {
  id: string;
  type: RoleType;
  name: string;
  description?: string;
  defaultWeight: number; // 0.0 - 1.0 (percentage of task value)
}

export interface TaskParticipant {
  personId: string;
  roleType: RoleType;
  weight: number; // Override of default role weight
  trackedTimeSeconds: number;
}

export interface TimeEntry {
  id: string;
  cardId: string;
  personId: string;
  roleType: RoleType;
  startTime: Date;
  endTime?: Date;
  durationSeconds: number;
  notes?: string;
  activityMarkers?: string[];
}

export interface RatePlan {
  id: string;
  personId: string;
  workspaceId: string;
  type: 'hourly' | 'daily' | 'weekly' | 'monthly_salary';
  baseRate: number; // Currency units
  currency: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  overtimeMultiplier?: number; // e.g., 1.5 for time-and-a-half
  nightDifferential?: number; // e.g., 0.15 for 15% extra
  weekendDifferential?: number;
  holidayDifferential?: number;
}

export interface CostProfile {
  id: string;
  workspaceId: string;
  country: string;
  name: string;
  payrollBurdenRate: number; // e.g., 0.30 for 30% employer taxes/benefits
  toolingCostPerMonth: number;
  overheadAllocationRate: number; // e.g., 0.20 for 20% overhead
  contingencyRate: number; // e.g., 0.10 for 10% contingency
  currency: string;
}

export interface LivingBaseline {
  id: string;
  personId: string;
  name: string;
  currency: string;
  monthlyBreakdown: {
    rent: number;
    utilities: number;
    internetMobile: number;
    homeInsurance: number;
    healthExpenses: number;
    food: number;
    transportation: number;
    childcare: number;
    debtPayments: number;
    clothing: number;
    medicine: number;
    emergencyFundSavings: number;
    leisureSocial: number;
    taxesFees: number;
  };
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export interface TaskLedgerEntry {
  id: string;
  cardId: string;
  workspaceId: string;
  projectId: string;
  participants: TaskParticipant[];
  timeEntries: string[]; // TimeEntry IDs
  estimatedHours?: number;
  actualHours: number;
  complexity: number;
  qualityScore?: number; // 0.0 - 1.0
  reviewScore?: number; // 0.0 - 1.0
  approvedBy?: string; // Person ID
  approvedAt?: Date;
  postedAt: Date;
  isLocked: boolean;
  valuationResult: ValuationResult;
}

export interface ValuationResult {
  taskId: string;
  totalLaborValue: number;
  totalEmployerCost: number;
  currency: string;
  participantPayouts: ParticipantPayout[];
  costBreakdown: CostBreakdown;
  calculatedAt: Date;
}

export interface ParticipantPayout {
  personId: string;
  roleType: RoleType;
  trackedHours: number;
  baseRate: number;
  complexityMultiplier: number;
  qualityMultiplier: number;
  grossPay: number;
  netPay?: number; // After taxes if calculated
  bonuses: PaymentComponent[];
  adjustments: PaymentComponent[];
}

export interface CostBreakdown {
  directLabor: number;
  payrollBurden: number;
  toolingAllocation: number;
  overheadAllocation: number;
  contingency: number;
  totalCost: number;
}

export interface PaymentComponent {
  type: PaymentType;
  amount: number;
  description?: string;
  calculationBasis?: string;
}

export enum PaymentType {
  // Time-based
  HOURLY_PAY = 'hourly_pay',
  DAILY_PAY = 'daily_pay',
  WEEKLY_PAY = 'weekly_pay',
  MONTHLY_SALARY = 'monthly_salary',
  OVERTIME = 'overtime',
  NIGHT_DIFFERENTIAL = 'night_differential',
  WEEKEND_DIFFERENTIAL = 'weekend_differential',
  HOLIDAY_DIFFERENTIAL = 'holiday_differential',
  ON_CALL_PAY = 'on_call_pay',
  CALL_OUT_PAY = 'call_out_pay',
  MINIMUM_SHIFT_PAY = 'minimum_shift_pay',
  
  // Task-based
  PER_TASK_FEE = 'per_task_fee',
  PER_STORY_POINT_FEE = 'per_story_point_fee',
  MILESTONE_BONUS = 'milestone_bonus',
  DELIVERY_BONUS = 'delivery_bonus',
  QUALITY_BONUS = 'quality_bonus',
  REWORK_PENALTY = 'rework_penalty',
  URGENCY_FEE = 'urgency_fee',
  RISK_PREMIUM = 'risk_premium',
  SPECIALTY_PREMIUM = 'specialty_premium',
  
  // Role/coordination
  SCRUM_CEREMONIES = 'scrum_ceremonies',
  BACKLOG_GROOMING = 'backlog_grooming',
  CROSS_TEAM_COORDINATION = 'cross_team_coordination',
  STAKEHOLDER_MANAGEMENT = 'stakeholder_management',
  CODE_REVIEW = 'code_review',
  QA_ALLOCATION = 'qa_allocation',
  DOCUMENTATION = 'documentation',
  RELEASE_MANAGEMENT = 'release_management',
  INCIDENT_POSTMORTEM = 'incident_postmortem',
  
  // Reimbursements
  TRAVEL_REIMBURSEMENT = 'travel_reimbursement',
  PER_DIEM = 'per_diem',
  ACCOMMODATION = 'accommodation',
  HOME_OFFICE_STIPEND = 'home_office_stipend',
  INTERNET_PHONE_STIPEND = 'internet_phone_stipend',
  EQUIPMENT_REIMBURSEMENT = 'equipment_reimbursement',
  TOOLING_REIMBURSEMENT = 'tooling_reimbursement',
  EDUCATION_BUDGET = 'education_budget',
  CONFERENCE_BUDGET = 'conference_budget',
  RELOCATION_ALLOWANCE = 'relocation_allowance',
  
  // Benefits
  HEALTH_INSURANCE = 'health_insurance',
  DENTAL_VISION = 'dental_vision',
  PENSION_CONTRIBUTION = 'pension_contribution',
  LIFE_INSURANCE = 'life_insurance',
  DISABILITY_INSURANCE = 'disability_insurance',
  WELLNESS_BENEFIT = 'wellness_benefit',
  PTO_ACCRUAL = 'pto_accrual',
  SICK_PAY = 'sick_pay',
  PARENTAL_LEAVE = 'parental_leave',
  STOCK_OPTIONS = 'stock_options',
  
  // Taxes
  EMPLOYER_PAYROLL_TAX = 'employer_payroll_tax',
  EMPLOYEE_WITHHOLDING = 'employee_withholding',
  PENSION_MANDATORY = 'pension_mandatory',
  UNION_FEES = 'union_fees',
  MANDATORY_INSURANCE = 'mandatory_insurance',
  
  // Cost overhead
  LICENSE_ALLOCATION = 'license_allocation',
  CLOUD_ALLOCATION = 'cloud_allocation',
  HARDWARE_DEPRECIATION = 'hardware_depreciation',
  OFFICE_SEAT_COST = 'office_seat_cost',
  ADMIN_OVERHEAD = 'admin_overhead',
  LEGAL_COMPLIANCE = 'legal_compliance',
  CONTINGENCY_RESERVE = 'contingency_reserve',
  WARRANTY_RESERVE = 'warranty_reserve',
  
  // Cashflow
  ADVANCE_FEE = 'advance_fee',
  SUBSCRIPTION_FEE = 'subscription_fee',
  TRANSACTION_FEE = 'transaction_fee',
  FX_FEE = 'fx_fee',
  CHARGEBACK_RESERVE = 'chargeback_reserve'
}
