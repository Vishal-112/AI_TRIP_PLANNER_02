export function detectRegion(destination) {
  const dest = destination.toLowerCase().trim();

  // INDIA - Comprehensive state & city mapping
  const indiaKeywords = [
    // Major cities
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'kolkata', 'chennai', 'hyderabad', 
    'pune', 'ahmedabad', 'jaipur', 'surat', 'lucknow', 'kanpur', 'nagpur', 'indore',
    'thane', 'bhopal', 'visakhapatnam', 'pimpri', 'patna', 'vadodara', 'ghaziabad',
    'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'varanasi',
    'srinagar', 'amritsar', 'allahabad', 'prayagraj', 'ranchi', 'howrah', 'coimbatore',
    'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota',
    'chandigarh', 'guwahati', 'solapur', 'hubli', 'mysore', 'tiruchirappalli', 'bareilly',
    'moradabad', 'mysuru', 'gurgaon', 'gurugram', 'noida', 'kochi', 'cochin',
    
    // States
    'maharashtra', 'karnataka', 'tamil nadu', 'kerala', 'gujarat', 'rajasthan',
    'uttar pradesh', 'madhya pradesh', 'west bengal', 'andhra pradesh', 'telangana',
    'punjab', 'haryana', 'bihar', 'odisha', 'jharkhand', 'assam', 'uttarakhand',
    'himachal pradesh', 'chhattisgarh', 'goa', 'jammu', 'kashmir',
    
    // Tourist destinations
    'goa', 'shimla', 'manali', 'ooty', 'darjeeling', 'ladakh', 'leh', 'udaipur',
    'jaisalmer', 'rishikesh', 'haridwar', 'munnar', 'kodaikanal', 'nainital',
    'mussoorie', 'mount abu', 'ajmer', 'pushkar', 'hampi', 'khajuraho', 'konark',
    'mahabalipuram', 'pondicherry', 'puducherry', 'andaman', 'lakshadweep',
    
    // Keywords
    'india', 'indian', 'bharat'
  ];

  // SOUTHEAST ASIA
  const southeastAsiaKeywords = [
    'thailand', 'bangkok', 'phuket', 'chiang mai', 'pattaya', 'krabi',
    'vietnam', 'hanoi', 'ho chi minh', 'saigon', 'da nang', 'hoi an',
    'singapore', 'bali', 'indonesia', 'jakarta', 'malaysia', 'kuala lumpur',
    'penang', 'langkawi', 'philippines', 'manila', 'boracay', 'cebu',
    'cambodia', 'siem reap', 'phnom penh', 'laos', 'myanmar', 'yangon'
  ];

  // EAST ASIA
  const eastAsiaKeywords = [
    'japan', 'tokyo', 'kyoto', 'osaka', 'hiroshima', 'nara', 'fukuoka', 'sapporo',
    'china', 'beijing', 'shanghai', 'hong kong', 'shenzhen', 'guangzhou', 'xian',
    'south korea', 'korea', 'seoul', 'busan', 'jeju', 'taiwan', 'taipei'
  ];

  // MIDDLE EAST
  const middleEastKeywords = [
    'dubai', 'uae', 'abu dhabi', 'sharjah', 'qatar', 'doha', 'saudi', 'riyadh',
    'jeddah', 'oman', 'muscat', 'bahrain', 'kuwait', 'israel', 'tel aviv', 
    'jerusalem', 'jordan', 'petra', 'turkey', 'istanbul', 'ankara'
  ];

  // EUROPE
  const europeKeywords = [
    'uk', 'london', 'manchester', 'edinburgh', 'glasgow', 'england', 'scotland', 'wales',
    'france', 'paris', 'lyon', 'marseille', 'nice', 'germany', 'berlin', 'munich',
    'frankfurt', 'hamburg', 'italy', 'rome', 'venice', 'florence', 'milan', 'naples',
    'spain', 'madrid', 'barcelona', 'seville', 'valencia', 'portugal', 'lisbon', 'porto',
    'netherlands', 'amsterdam', 'rotterdam', 'belgium', 'brussels', 'switzerland',
    'zurich', 'geneva', 'austria', 'vienna', 'greece', 'athens', 'santorini', 'mykonos',
    'czech', 'prague', 'poland', 'warsaw', 'krakow', 'sweden', 'stockholm', 'norway',
    'oslo', 'denmark', 'copenhagen', 'finland', 'helsinki'
  ];

  // USA & CANADA
  const northAmericaKeywords = [
    'usa', 'america', 'new york', 'nyc', 'los angeles', 'la', 'chicago', 'houston',
    'miami', 'san francisco', 'seattle', 'boston', 'washington dc', 'vegas', 
    'las vegas', 'orlando', 'philadelphia', 'phoenix', 'san diego', 'dallas',
    'canada', 'toronto', 'vancouver', 'montreal', 'ottawa', 'calgary'
  ];

  // OCEANIA
  const oceaniaKeywords = [
    'australia', 'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide',
    'new zealand', 'auckland', 'wellington', 'queenstown', 'christchurch'
  ];

  // SOUTH AMERICA
  const southAmericaKeywords = [
    'brazil', 'rio', 'sao paulo', 'argentina', 'buenos aires', 'chile', 'santiago',
    'peru', 'lima', 'machu picchu', 'cusco', 'colombia', 'bogota', 'cartagena'
  ];

  // AFRICA
  const africaKeywords = [
    'south africa', 'cape town', 'johannesburg', 'egypt', 'cairo', 'luxor',
    'morocco', 'marrakech', 'casablanca', 'kenya', 'nairobi', 'tanzania',
    'zanzibar', 'ethiopia', 'madagascar'
  ];

  // Check region
  if (indiaKeywords.some(keyword => dest.includes(keyword))) return 'india';
  if (southeastAsiaKeywords.some(keyword => dest.includes(keyword))) return 'southeast_asia';
  if (eastAsiaKeywords.some(keyword => dest.includes(keyword))) return 'east_asia';
  if (middleEastKeywords.some(keyword => dest.includes(keyword))) return 'middle_east';
  if (europeKeywords.some(keyword => dest.includes(keyword))) return 'europe';
  if (northAmericaKeywords.some(keyword => dest.includes(keyword))) return 'north_america';
  if (oceaniaKeywords.some(keyword => dest.includes(keyword))) return 'oceania';
  if (southAmericaKeywords.some(keyword => dest.includes(keyword))) return 'south_america';
  if (africaKeywords.some(keyword => dest.includes(keyword))) return 'africa';

  return 'india'; // Default to India if unknown
}