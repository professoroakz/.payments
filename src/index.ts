/**
 * Task Value Ledger - Main Entry Point
 * 
 * A comprehensive task management system with time tracking, role-based valuation,
 * and payroll/budget outputs that reconcile work performed, agreed compensation
 * structures, and minimum viable living cost obligations.
 */

// Core types
export * from './types/entities';

// Calculation engines
export { TaskValuationEngine, ValuationConfig, DEFAULT_VALUATION_CONFIG } from './engine/TaskValuationEngine';
export { LivingBaselineCalculator, BaselineCoverageReport } from './engine/LivingBaselineCalculator';

// Utilities
export { PaymentCalculator, PaymentPolicy } from './utils/PaymentCalculator';

// Example configurations
export { ratePlanExamples } from './models/ratePlanExamples';
export { costProfileExamples } from './models/costProfileExamples';
export { livingBaselineExamples } from './models/livingBaselineExamples';
