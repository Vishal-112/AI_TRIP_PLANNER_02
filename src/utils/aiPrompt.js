export const generateTripPrompt = (city, days, budget, people = 1) => {
  return `
You are a travel planning expert. Create a detailed ${days}-day itinerary for ${city}.

**REQUIREMENTS:**
- Total Budget: ₹${budget} INR for ${people} person(s)
- Duration: ${days} days
- Currency: All costs must be in Indian Rupees (₹ INR)

**IMPORTANT INSTRUCTIONS:**
1. Search for REAL places in ${city} - include popular attractions, hidden gems, local markets, temples, museums, parks, restaurants, and cafes
2. For Indian cities: Include local landmarks, street food spots, historical sites, religious places, and regional specialties
3. For international cities: Include major tourist attractions, local neighborhoods, authentic restaurants, and cultural sites
4. Provide REALISTIC cost estimates in ₹ INR:
   - Accommodation per night
   - Food per meal (breakfast, lunch, dinner)
   - Transportation (local, intercity if needed)
   - Entry fees for attractions
   - Shopping/miscellaneous
5. Break down budget day-wise
6. Suggest budget-friendly alternatives if total budget is tight
7. Include morning, afternoon, and evening activities for each day
8. Add local food recommendations with approximate costs
9. Include travel tips specific to ${city}

**OUTPUT FORMAT (Strict JSON):**
{
  "destination": "${city}",
  "duration": ${days},
  "totalBudget": ${budget},
  "currency": "INR",
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 - Arrival & Exploration",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Visit [Real Place Name]",
          "description": "Brief description of the place",
          "cost": 500,
          "duration": "2 hours",
          "category": "Sightseeing"
        }
      ],
      "meals": [
        {
          "type": "Breakfast",
          "suggestion": "Local dish name at [Restaurant name]",
          "cost": 200
        },
        {
          "type": "Lunch",
          "suggestion": "Local dish name at [Restaurant name]",
          "cost": 400
        },
        {
          "type": "Dinner",
          "suggestion": "Local dish name at [Restaurant name]",
          "cost": 500
        }
      ],
      "accommodation": {
        "type": "Hotel/Hostel/Guesthouse",
        "suggestion": "Budget/mid-range option name",
        "cost": 2000
      },
      "transport": {
        "description": "Local transport methods",
        "cost": 300
      },
      "dailyTotal": 3900
    }
  ],
  "budgetBreakdown": {
    "accommodation": 6000,
    "food": 3300,
    "transport": 900,
    "activities": 1500,
    "miscellaneous": 1300,
    "total": 13000
  },
  "travelTips": [
    "Tip 1 specific to ${city}",
    "Tip 2 about local culture",
    "Tip 3 about safety or transport"
  ]
}

**CRITICAL:** 
- Use ONLY real place names, restaurants, and attractions in ${city}
- All costs MUST be in ₹ INR (Indian Rupees)
- Calculate costs realistically based on ${city}'s actual price levels
- Do NOT use placeholder names like [Place Name] or [Restaurant]
- Return ONLY valid JSON, no markdown formatting
`;
};