/**
 * Example rate plan configurations
 */

import { RatePlan } from '../types/entities';

/**
 * Hourly contractor rate plan
 */
export const exampleHourlyContractor: Partial<RatePlan> = {
  type: 'hourly',
  baseRate: 75.00,
  currency: 'USD',
  overtimeMultiplier: 1.5,
  nightDifferential: 0.15,
  weekendDifferential: 0.20,
  holidayDifferential: 0.50
};

/**
 * Daily consultant rate plan
 */
export const exampleDailyConsultant: Partial<RatePlan> = {
  type: 'daily',
  baseRate: 600.00,
  currency: 'USD',
  overtimeMultiplier: 1.25
};

/**
 * Monthly salaried employee rate plan
 */
export const exampleMonthlySalaried: Partial<RatePlan> = {
  type: 'monthly_salary',
  baseRate: 8000.00,
  currency: 'USD',
  overtimeMultiplier: 1.5
};

/**
 * Senior developer hourly rate
 */
export const exampleSeniorDeveloper: Partial<RatePlan> = {
  type: 'hourly',
  baseRate: 125.00,
  currency: 'USD',
  overtimeMultiplier: 1.5,
  nightDifferential: 0.20,
  weekendDifferential: 0.25,
  holidayDifferential: 1.0
};

/**
 * Junior developer hourly rate
 */
export const exampleJuniorDeveloper: Partial<RatePlan> = {
  type: 'hourly',
  baseRate: 45.00,
  currency: 'USD',
  overtimeMultiplier: 1.5,
  nightDifferential: 0.15,
  weekendDifferential: 0.20
};

/**
 * QA engineer hourly rate
 */
export const exampleQAEngineer: Partial<RatePlan> = {
  type: 'hourly',
  baseRate: 55.00,
  currency: 'USD',
  overtimeMultiplier: 1.5
};

/**
 * Scrum Master hourly rate
 */
export const exampleScrumMaster: Partial<RatePlan> = {
  type: 'hourly',
  baseRate: 85.00,
  currency: 'USD'
};

/**
 * Designer hourly rate
 */
export const exampleDesigner: Partial<RatePlan> = {
  type: 'hourly',
  baseRate: 95.00,
  currency: 'USD',
  overtimeMultiplier: 1.5
};

/**
 * DevOps/SRE hourly rate
 */
export const exampleDevOps: Partial<RatePlan> = {
  type: 'hourly',
  baseRate: 110.00,
  currency: 'USD',
  overtimeMultiplier: 1.5,
  nightDifferential: 0.25,
  weekendDifferential: 0.30,
  holidayDifferential: 1.0
};

export const ratePlanExamples = {
  hourlyContractor: exampleHourlyContractor,
  dailyConsultant: exampleDailyConsultant,
  monthlySalaried: exampleMonthlySalaried,
  seniorDeveloper: exampleSeniorDeveloper,
  juniorDeveloper: exampleJuniorDeveloper,
  qaEngineer: exampleQAEngineer,
  scrumMaster: exampleScrumMaster,
  designer: exampleDesigner,
  devOps: exampleDevOps
};
