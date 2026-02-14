export function detectRegion(destination) {
  const d = destination.toLowerCase();

  if (["india", "delhi", "mumbai", "goa"].some(k => d.includes(k)))
    return "india";

  if (["thailand", "bali", "vietnam", "singapore"].some(k => d.includes(k)))
    return "southeast_asia";

  if (["japan", "tokyo", "osaka"].some(k => d.includes(k)))
    return "japan";

  if (["france", "italy", "germany", "europe"].some(k => d.includes(k)))
    return "europe";

  if (["usa", "new york", "california"].some(k => d.includes(k)))
    return "usa";

  return "europe"; // default fallback
}
