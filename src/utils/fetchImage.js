export async function fetchImage(query) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_KEY}`,
        },
      }
    );

    const data = await res.json();
    return data?.results?.[0]?.urls?.regular || null;
  } catch (err) {
    console.error("Unsplash error:", err);
    return null;
  }
}
