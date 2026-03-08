import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./TripMap.css";

// Fix for default marker icons in Leaflet with Vite/Webpack
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function TripMap({ from, to, place }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Validate coordinates
    if (!from || !to || !from.lat || !from.lon || !to.lat || !to.lon) {
      console.error("❌ Invalid coordinates:", { from, to });
      return;
    }

    // Ensure coordinates are numbers
    const fromLat = Number(from.lat);
    const fromLon = Number(from.lon);
    const toLat = Number(to.lat);
    const toLon = Number(to.lon);

    // Validate number conversion
    if (isNaN(fromLat) || isNaN(fromLon) || isNaN(toLat) || isNaN(toLon)) {
      console.error("❌ Coordinates are not valid numbers:", { from, to });
      return;
    }

    console.log("✅ Rendering map with coordinates:", {
      from: { lat: fromLat, lon: fromLon },
      to: { lat: toLat, lon: toLon }
    });

    // Destroy existing map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create map instance
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // 🌍 OPTION 1: CartoDB Voyager (Recommended - Clean English labels)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    // 🌍 OPTION 2: CartoDB Positron (Light theme with English)
    // Uncomment to use this instead:
    /*
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);
    */

    // 🌍 OPTION 3: Esri World Street Map (English labels)
    // Uncomment to use this instead:
    /*
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    }).addTo(map);
    */

    // Create custom icons
    const startIcon = L.divIcon({
      className: "custom-marker start-marker",
      html: '<div class="marker-pin start-pin">📍</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    const endIcon = L.divIcon({
      className: "custom-marker end-marker",
      html: '<div class="marker-pin end-pin">🎯</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Get place names (use English name if available)
    const fromName = from.name || "Starting Point";
    const toName = to.name || place || "Destination";

    // Add markers with English names
    const startMarker = L.marker([fromLat, fromLon], { icon: startIcon })
      .addTo(map)
      .bindPopup(`<b>Starting Point</b><br>${fromName}`);

    const endMarker = L.marker([toLat, toLon], { icon: endIcon })
      .addTo(map)
      .bindPopup(`<b>Destination</b><br>${toName}`);

    // Draw route line
    const routeLine = L.polyline(
      [
        [fromLat, fromLon],
        [toLat, toLon],
      ],
      {
        color: "#6366f1",
        weight: 4,
        opacity: 0.7,
        dashArray: "10, 10",
        lineJoin: "round",
      }
    ).addTo(map);

    // Fit map to show both markers
    const bounds = L.latLngBounds([
      [fromLat, fromLon],
      [toLat, toLon],
    ]);

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 12,
    });

    // Open start marker popup after a delay
    setTimeout(() => {
      startMarker.openPopup();
    }, 500);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [from, to, place]);

  return (
    <div className="trip-map-container">
      <div ref={mapRef} className="trip-map"></div>
    </div>
  );
}

export default TripMap;