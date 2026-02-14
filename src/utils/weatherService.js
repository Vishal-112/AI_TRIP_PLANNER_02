export const fetchWeather = async (city) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
    );

    if (!res.ok) return null;

    const data = await res.json();

    return {
      temp: data.main.temp,
      condition: data.weather[0].main,
    };
  } catch {
    return null;
  }
};
