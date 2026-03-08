export const getCoordinates = async (place) => {
  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  if (!API_KEY) {
    console.error("❌ Geoapify API key missing");
    return null;
  }

  try {
    // Add lang=en parameter to force English results
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      place
    )}&limit=1&lang=en&apiKey=${API_KEY}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("❌ Geoapify response error:", res.status);
      return null;
    }

    const data = await res.json();

    if (!data?.features?.length) {
      console.error("❌ No coordinates found for:", place);
      return null;
    }

    const [lon, lat] = data.features[0].geometry.coordinates;
    const properties = data.features[0].properties;

    // Get English place name from the response
    const englishName = properties.name || properties.city || properties.state || place;

    console.log("✅ Coordinates found:", {
      place: englishName,
      lat: Number(lat),
      lon: Number(lon)
    });

    // ✅ IMPORTANT: convert to numbers for Leaflet
    return {
      lat: Number(lat),
      lon: Number(lon),
      name: englishName, // English name
    };

  } catch (err) {
    console.error("❌ Geoapify fetch failed:", err);
    return null;
  }
};