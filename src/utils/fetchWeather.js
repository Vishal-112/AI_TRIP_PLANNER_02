export const fetchWeather = async (city) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
    );

    if (!res.ok) {
      console.error("Weather API error:", res.status);
      return null;
    }

    const data = await res.json();

    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
    };
  } catch (err) {
    console.error("Weather fetch error:", err);
    return null;
  }
};
