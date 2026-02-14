export const getCoordinates = async (place) => {
  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  if (!API_KEY) {
    console.error("❌ Geoapify API key missing");
    return null;
  }

  try {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      place
    )}&limit=1&apiKey=${API_KEY}`;

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

    return { lat, lon };
  } catch (err) {
    console.error("❌ Geoapify fetch failed:", err);
    return null;
  }
};
