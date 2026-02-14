import { destinationCostIndex } from "./destinationCostIndex";
import { detectRegion } from "./detectRegion";

export function validateBudget(destination, totalBudget, days = 3, people = 1) {
  const region = detectRegion(destination);
  const costIndex = destinationCostIndex[region] || 2;

  // Base daily cost per person (₹)
  const BASE_DAILY_COST = 3000;

  const minRequired =
    BASE_DAILY_COST * costIndex * days * people;

  if (totalBudget < minRequired) {
    return {
      valid: false,
      minBudget: Math.ceil(minRequired),
      region,
    };
  }

  return {
    valid: true,
    region,
  };
}
