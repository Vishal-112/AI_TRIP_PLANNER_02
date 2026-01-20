import { useState } from "react";
import TripForm from "../components/TripForm";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { fetchImage } from "../utils/fetchImage";
import { useAuth } from "../context/AuthContext";
import { validateBudget } from "../utils/validateBudget";

function CreateTrip() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [placeImages, setPlaceImages] = useState({});

  const extractPlaces = (text) => {
    return (
      text.match(/- (.+)/g)?.map((p) => p.replace("- ", "").trim()) || []
    );
  };

  const handleTripCreate = async (data) => {
    if (loading || !user) return;

    try {
      setLoading(true);
      setError(null);

      /* =========================
         ✅ BUDGET VALIDATION FIX
      ========================== */
      const budgetCheck = validateBudget(
        data.destination,
        data.budget
      );

      if (!budgetCheck.valid) {
        setError(
          `❌ Budget too low for ${data.destination}.
Minimum required budget is ₹${budgetCheck.minBudget.toLocaleString()}`
        );
        setLoading(false);
        return; // 🚫 STOP AI CALL
      }

      /* =========================
         AI PROMPT
      ========================== */
      const prompt = `
Create a realistic ${data.days}-day travel itinerary.

From: ${data.from}
Destination: ${data.destination}
People: ${data.members}
Total Budget: ₹${data.budget}
Transport: ${data.transport}

Rules:
- Do not exceed the budget
- Suggest realistic hotels & transport
- Adjust quality based on budget
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

      /* =========================
         IMAGES
      ========================== */
      const destImg = await fetchImage(data.destination);
      setHeroImage(destImg);

      const places = extractPlaces(text);
      const images = {};

      for (let place of places.slice(0, 6)) {
        images[place] = await fetchImage(
          place + " " + data.destination
        );
      }

      setPlaceImages(images);

      /* =========================
         SAVE TO FIRESTORE
      ========================== */
      await addDoc(collection(db, "trips"), {
        ...data,
        userId: user.uid, // 🔑 IMPORTANT FOR HISTORY
        itinerary: text,
        heroImage: destImg,
        placeImages: images,
        createdAt: new Date(),
      });

      setTrip({ ...data, text });
    } catch (err) {
      console.error(err);
      setError("Failed to generate trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-card">
        <h1 className="create-title">✈️ AI Trip Planner</h1>
        <p className="create-subtitle">
          Plan real-world trips with AI
        </p>

        {loading && <p>✨ Generating your trip...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !trip && (
          <TripForm onSubmit={handleTripCreate} />
        )}
      </div>

      {trip && (
        <div className="result-card">
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
          <p>
            📍 {trip.from} → {trip.destination}
          </p>
          <p>
            👥 {trip.members} • 🕒 {trip.days} days • 🚆{" "}
            {trip.transport}
          </p>
          <p>💰 ₹{trip.budget}</p>

          <div className="itinerary-box">{trip.text}</div>

          {Object.keys(placeImages).length > 0 && (
            <>
              <h3 style={{ marginTop: "25px" }}>
                📸 Places You'll Visit
              </h3>

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
                        <p
                          style={{
                            marginTop: "6px",
                            fontSize: "14px",
                          }}
                        >
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
