import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function TripMap({ from, to, markers = [], weather, place }) {
  if (!from || !to) return null;

  const route = [
    [from.lat, from.lon],
    [to.lat, to.lon],
  ];

  return (
    <div style={{ position: "relative", marginTop: "30px" }}>
      {/* 🌦️ WEATHER OVERLAY */}
      {weather && (
        <div className="weather-overlay">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="weather"
          />
          <div>
            <strong>{weather.temp}°C</strong>
            <p>{weather.condition}</p>
          </div>
        </div>
      )}

      <MapContainer
        center={[to.lat, to.lon]}
        zoom={5}
        style={{ height: "380px", width: "100%", borderRadius: "16px" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <Marker position={[from.lat, from.lon]}>
          <Popup>Start</Popup>
        </Marker>

        <Marker position={[to.lat, to.lon]}>
          <Popup>{place}</Popup>
        </Marker>

        {/* 📍 DAY-WISE MARKERS */}
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lon]}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}

        <Polyline positions={route} color="#38bdf8" />
      </MapContainer>
    </div>
  );
}

export default TripMap;
