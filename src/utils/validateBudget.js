import { destinationCostIndex } from "./destinationCostIndex";
import { detectRegion } from "./detectRegion";

export const validateBudget = (destination, budget, days, travelers) => {
  const region = detectRegion(destination);
  const costMultiplier = destinationCostIndex[region] || 1; // Default to India if not found
  const baseCostPerDay = 3000; // Base cost for India
  const costPerDay = baseCostPerDay * costMultiplier;
  const totalEstimatedCost = costPerDay * days * travelers;

  return {
    valid: budget >= totalEstimatedCost,
    minBudget: totalEstimatedCost,
    estimatedCost: totalEstimatedCost,
  };
};