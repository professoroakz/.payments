/**
 * Example living baseline configurations for different scenarios
 */

import { LivingBaseline } from '../types/entities';

/**
 * Single person, urban area (US)
 */
export const exampleSingleUrban: Partial<LivingBaseline> = {
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
  }
};

/**
 * Family with children (US)
 */
export const exampleFamilyWithChildren: Partial<LivingBaseline> = {
  name: 'Family with 2 Children - Urban US',
  currency: 'USD',
  monthlyBreakdown: {
    rent: 2800,
    utilities: 250,
    internetMobile: 150,
    homeInsurance: 100,
    healthExpenses: 600,
    food: 1200,
    transportation: 400,
    childcare: 2000,
    debtPayments: 500,
    clothing: 250,
    medicine: 100,
    emergencyFundSavings: 500,
    leisureSocial: 300,
    taxesFees: 250
  }
};

/**
 * Single person, rural area (US)
 */
export const exampleSingleRural: Partial<LivingBaseline> = {
  name: 'Single Person - Rural US',
  currency: 'USD',
  monthlyBreakdown: {
    rent: 800,
    utilities: 150,
    internetMobile: 80,
    homeInsurance: 40,
    healthExpenses: 250,
    food: 400,
    transportation: 300, // Higher due to car dependency
    childcare: 0,
    debtPayments: 150,
    clothing: 75,
    medicine: 40,
    emergencyFundSavings: 200,
    leisureSocial: 150,
    taxesFees: 100
  }
};

/**
 * Single person, London (UK)
 */
export const exampleSingleLondon: Partial<LivingBaseline> = {
  name: 'Single Person - London UK',
  currency: 'GBP',
  monthlyBreakdown: {
    rent: 1500,
    utilities: 150,
    internetMobile: 50,
    homeInsurance: 30,
    healthExpenses: 100, // NHS covers most
    food: 400,
    transportation: 150, // Public transport
    childcare: 0,
    debtPayments: 200,
    clothing: 100,
    medicine: 30,
    emergencyFundSavings: 300,
    leisureSocial: 200,
    taxesFees: 100
  }
};

/**
 * Single person, Berlin (Germany)
 */
export const exampleSingleBerlin: Partial<LivingBaseline> = {
  name: 'Single Person - Berlin Germany',
  currency: 'EUR',
  monthlyBreakdown: {
    rent: 1000,
    utilities: 200,
    internetMobile: 40,
    homeInsurance: 30,
    healthExpenses: 200,
    food: 350,
    transportation: 80, // Public transport
    childcare: 0,
    debtPayments: 100,
    clothing: 80,
    medicine: 40,
    emergencyFundSavings: 250,
    leisureSocial: 150,
    taxesFees: 80
  }
};

/**
 * Single person, Bangalore (India)
 */
export const exampleSingleBangalore: Partial<LivingBaseline> = {
  name: 'Single Person - Bangalore India',
  currency: 'INR',
  monthlyBreakdown: {
    rent: 25000,
    utilities: 3000,
    internetMobile: 1000,
    homeInsurance: 500,
    healthExpenses: 3000,
    food: 8000,
    transportation: 5000,
    childcare: 0,
    debtPayments: 5000,
    clothing: 2000,
    medicine: 1500,
    emergencyFundSavings: 10000,
    leisureSocial: 5000,
    taxesFees: 2000
  }
};

/**
 * Minimal survival baseline (US)
 */
export const exampleMinimalSurvival: Partial<LivingBaseline> = {
  name: 'Minimal Survival - US',
  currency: 'USD',
  monthlyBreakdown: {
    rent: 1000,
    utilities: 100,
    internetMobile: 50,
    homeInsurance: 25,
    healthExpenses: 150,
    food: 300,
    transportation: 100,
    childcare: 0,
    debtPayments: 0,
    clothing: 50,
    medicine: 30,
    emergencyFundSavings: 50,
    leisureSocial: 50,
    taxesFees: 50
  }
};

/**
 * Comfortable living (US)
 */
export const exampleComfortable: Partial<LivingBaseline> = {
  name: 'Comfortable Living - US',
  currency: 'USD',
  monthlyBreakdown: {
    rent: 2500,
    utilities: 200,
    internetMobile: 150,
    homeInsurance: 80,
    healthExpenses: 400,
    food: 800,
    transportation: 400,
    childcare: 0,
    debtPayments: 300,
    clothing: 200,
    medicine: 75,
    emergencyFundSavings: 1000,
    leisureSocial: 500,
    taxesFees: 200
  }
};

export const livingBaselineExamples = {
  singleUrban: exampleSingleUrban,
  familyWithChildren: exampleFamilyWithChildren,
  singleRural: exampleSingleRural,
  singleLondon: exampleSingleLondon,
  singleBerlin: exampleSingleBerlin,
  singleBangalore: exampleSingleBangalore,
  minimalSurvival: exampleMinimalSurvival,
  comfortable: exampleComfortable
};
