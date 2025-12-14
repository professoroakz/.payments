/**
 * Example cost profile configurations for different countries and contexts
 */

import { CostProfile } from '../types/entities';

/**
 * US-based company cost profile
 */
export const exampleUSCostProfile: Partial<CostProfile> = {
  country: 'US',
  name: 'US Standard Employee Cost',
  payrollBurdenRate: 0.30, // 30% for FICA, unemployment, workers comp, etc.
  toolingCostPerMonth: 500, // IDE, SaaS subscriptions, etc.
  overheadAllocationRate: 0.25, // 25% for office, admin, HR, etc.
  contingencyRate: 0.10, // 10% contingency
  currency: 'USD'
};

/**
 * UK-based company cost profile
 */
export const exampleUKCostProfile: Partial<CostProfile> = {
  country: 'UK',
  name: 'UK Standard Employee Cost',
  payrollBurdenRate: 0.27, // National Insurance, pension contributions
  toolingCostPerMonth: 400,
  overheadAllocationRate: 0.25,
  contingencyRate: 0.10,
  currency: 'GBP'
};

/**
 * Germany cost profile
 */
export const exampleGermanyCostProfile: Partial<CostProfile> = {
  country: 'DE',
  name: 'Germany Standard Employee Cost',
  payrollBurdenRate: 0.40, // Higher social insurance contributions
  toolingCostPerMonth: 450,
  overheadAllocationRate: 0.20,
  contingencyRate: 0.10,
  currency: 'EUR'
};

/**
 * India cost profile
 */
export const exampleIndiaCostProfile: Partial<CostProfile> = {
  country: 'IN',
  name: 'India Standard Employee Cost',
  payrollBurdenRate: 0.20, // PF, ESI, gratuity
  toolingCostPerMonth: 200,
  overheadAllocationRate: 0.15,
  contingencyRate: 0.10,
  currency: 'INR'
};

/**
 * Startup/lean cost profile
 */
export const exampleStartupCostProfile: Partial<CostProfile> = {
  country: 'US',
  name: 'Startup Lean Cost',
  payrollBurdenRate: 0.25,
  toolingCostPerMonth: 300,
  overheadAllocationRate: 0.15, // Lower overhead
  contingencyRate: 0.05,
  currency: 'USD'
};

/**
 * Enterprise cost profile
 */
export const exampleEnterpriseCostProfile: Partial<CostProfile> = {
  country: 'US',
  name: 'Enterprise Full Cost',
  payrollBurdenRate: 0.35, // Comprehensive benefits
  toolingCostPerMonth: 800, // More tools and licenses
  overheadAllocationRate: 0.35, // Higher overhead (compliance, legal, etc.)
  contingencyRate: 0.15,
  currency: 'USD'
};

/**
 * Remote contractor cost profile
 */
export const exampleRemoteContractorCostProfile: Partial<CostProfile> = {
  country: 'US',
  name: 'Remote Contractor Cost',
  payrollBurdenRate: 0.10, // Minimal burden for contractors
  toolingCostPerMonth: 100, // They provide own tools
  overheadAllocationRate: 0.10, // Minimal overhead
  contingencyRate: 0.05,
  currency: 'USD'
};

export const costProfileExamples = {
  us: exampleUSCostProfile,
  uk: exampleUKCostProfile,
  germany: exampleGermanyCostProfile,
  india: exampleIndiaCostProfile,
  startup: exampleStartupCostProfile,
  enterprise: exampleEnterpriseCostProfile,
  remoteContractor: exampleRemoteContractorCostProfile
};
