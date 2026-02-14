import { useState } from "react";
import TripForm from "../components/TripForm";
import TripMap from "../components/TripMap";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { fetchImage } from "../utils/fetchImage";
import { getCoordinates } from "../utils/getCoordinates";
import { validateBudget } from "../utils/validateBudget";
import { fetchWeather } from "../utils/fetchWeather";
import { useAuth } from "../context/AuthContext";
import { exportTripAsPDF } from "../utils/exportPdf";

function CreateTrip() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);

  const [heroImage, setHeroImage] = useState(null);
  const [placeImages, setPlaceImages] = useState({});

  const [routeCoords, setRouteCoords] = useState(null);
  const [weather, setWeather] = useState(null);

  // 🔹 NEW: Shareable link
  const [shareUrl, setShareUrl] = useState(null);

  /* =========================
     HELPER: EXTRACT PLACES
  ========================== */
  const extractPlaces = (text) => {
    return (
      text.match(/- (.+)/g)?.map((p) => p.replace("- ", "").trim()) || []
    );
  };

  /* =========================
     MAIN HANDLER
  ========================== */
  const handleTripCreate = async (data) => {
    if (loading || !user) return;

    try {
      setLoading(true);
      setError(null);

      const budgetCheck = validateBudget(
        data.destination,
        data.budget,
        data.days,
        data.members
      );

      if (!budgetCheck.valid) {
        setError(
          `❌ Budget too low for ${data.destination}.
Minimum required budget is ₹${budgetCheck.minBudget.toLocaleString()}`
        );
        setLoading(false);
        return;
      }

      const perDayBudget = Math.floor(data.budget / data.days);
      const perPersonBudget = Math.floor(data.budget / data.members);

      const prompt = `
Create a realistic ${data.days}-day travel itinerary.

From: ${data.from}
Destination: ${data.destination}
Region: ${budgetCheck.region}
People: ${data.members}

Total Budget: ₹${data.budget}
Daily Budget: ₹${perDayBudget}
Per Person Budget: ₹${perPersonBudget}

Transport: ${data.transport}

Rules:
- Do NOT exceed the given budget
- Adjust hotel, food & activities based on budget
- Day-wise plan only
- Use bullet points
- No JSON, no markdown
      `;

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const result = await res.json();
      const text = result.choices[0].message.content;

      const fromCoords = await getCoordinates(data.from);
      const toCoords = await getCoordinates(data.destination);

      setRouteCoords({ from: fromCoords, to: toCoords });

      const weatherData = await fetchWeather(data.destination);
      setWeather(weatherData);

      const destImg = await fetchImage(data.destination);
      setHeroImage(destImg);

      const places = extractPlaces(text);
      const images = {};
      for (let place of places.slice(0, 6)) {
        images[place] = await fetchImage(place + " " + data.destination);
      }
      setPlaceImages(images);

      // 🔹 UPDATED: capture docRef
      const docRef = await addDoc(collection(db, "trips"), {
        ...data,
        userId: user.uid,
        region: budgetCheck.region,
        perDayBudget,
        perPersonBudget,
        itinerary: text,
        heroImage: destImg,
        placeImages: images,
        routeCoords: { from: fromCoords, to: toCoords },
        weather: weatherData,
        createdAt: new Date(),
      });

      // 🔹 NEW: generate share link
      const url = `${window.location.origin}/trip/${docRef.id}`;
      setShareUrl(url);

      setTrip({ ...data, text });
    } catch (err) {
      console.error(err);
      setError("Failed to generate trip");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="create-page">
      <div className="create-card">
        <h1 className="create-title">✈️ AI Trip Planner</h1>
        <p className="create-subtitle">Plan real-world trips with AI</p>

        {loading && <p>✨ Generating your trip...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !trip && (
          <TripForm onSubmit={handleTripCreate} />
        )}
      </div>

      {trip && (
        <div className="result-card" id="trip-result">
          {heroImage && (
            <img
              src={heroImage}
              alt={trip.destination}
              style={{
                width: "100%",
                height: "320px",
                objectFit: "cover",
                borderRadius: "16px",
                marginBottom: "20px",
              }}
            />
          )}

          <h2>🗺️ Trip Overview</h2>
          <p>📍 {trip.from} → {trip.destination}</p>
          <p>
            👥 {trip.members} • 🕒 {trip.days} days • 🚆 {trip.transport}
          </p>
          <p>💰 ₹{trip.budget}</p>

          {weather && (
            <p>
              🌦️ {weather.condition} • {weather.temp}°C
            </p>
          )}

          {/* 🔹 EXPORT PDF */}
          <button
            onClick={exportTripAsPDF}
            style={{
              marginTop: "15px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              background: "#38bdf8",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            📄 Export as PDF
          </button>

          {/* 🔹 SHARE LINK */}
          {shareUrl && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert("Shareable link copied!");
              }}
              style={{
                marginLeft: "10px",
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #38bdf8",
                background: "transparent",
                color: "#38bdf8",
                cursor: "pointer",
              }}
            >
              🔗 Copy Share Link
            </button>
          )}

          <div className="itinerary-box">{trip.text}</div>

          {routeCoords && (
            <>
              <h3 style={{ marginTop: "30px" }}>🗺️ Route Map</h3>
              <TripMap
                from={routeCoords.from}
                to={routeCoords.to}
                place={trip.destination}
              />
            </>
          )}

          {Object.keys(placeImages).length > 0 && (
            <>
              <h3 style={{ marginTop: "25px" }}>📸 Places You'll Visit</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "15px",
                  marginTop: "15px",
                }}
              >
                {Object.entries(placeImages).map(
                  ([place, img]) =>
                    img && (
                      <div key={place}>
                        <img
                          src={img}
                          alt={place}
                          style={{
                            width: "100%",
                            height: "160px",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                        />
                        <p style={{ marginTop: "6px", fontSize: "14px" }}>
                          {place}
                        </p>
                      </div>
                    )
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CreateTrip;
