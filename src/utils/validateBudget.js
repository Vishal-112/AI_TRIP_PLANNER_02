import { MIN_BUDGET_BY_DESTINATION } from "./budgetRules";

export function validateBudget(destination, budget) {
  if (!destination || !budget) {
    return { valid: false };
  }

  const key = destination.toLowerCase().trim();
  const minBudget = MIN_BUDGET_BY_DESTINATION[key];

  // Agar destination rule me nahi hai → AI ko allow karo
  if (!minBudget) {
    return { valid: true };
  }

  if (budget < minBudget) {
    return {
      valid: false,
      minBudget,
    };
  }

  return { valid: true };
}
