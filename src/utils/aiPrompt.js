export const generateTripPrompt = (city, days, budget) => {
  return `
Create a ${days}-day travel itinerary for ${city}.
Budget: ${budget} INR.

Include:
- Day wise plan
- Places to visit
- Food suggestions
- Estimated daily cost

Return response strictly in JSON.
`;
};
