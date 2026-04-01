import { useState } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { fetchImage } from "../utils/fetchImage";
import { getCoordinates } from "../utils/getCoordinates";
import { validateBudget } from "../utils/validateBudget";
import { fetchWeather } from "../utils/fetchWeather";
import { useAuth } from "../context/AuthContext";
import { exportTripAsPDF } from "../utils/exportPdf";
import { Link } from "react-router-dom";
import TripMap from "../components/TripMap";
import "./CreateTrip.css";

function CreateTrip() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);

  // Form states
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(50000);
  const [travelers, setTravelers] = useState(2);
  const [interests, setInterests] = useState([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [from, setFrom] = useState("");
  const [days, setDays] = useState(5);
  const [transport, setTransport] = useState("Train");

  const [heroImage, setHeroImage] = useState(null);
  const [placeImages, setPlaceImages] = useState({});
  const [routeCoords, setRouteCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [shareUrl, setShareUrl] = useState(null);

  const interestOptions = [
    "Cultural Heritage",
    "Adventure Sports",
    "Nightlife",
    "Food & Cuisine",
    "Nature & Wildlife",
    "Photography",
    "Spiritual Journeys",
    "Beach & Relaxation",
    "Shopping",
    "Local Experiences"
  ];

  /* ========================= HELPER: EXTRACT PLACES ========================== */
  const extractPlaces = (text) => {
    return (
      text.match(/- (.+)/g)?.map((p) => p.replace("- ", "").trim()) || []
    );
  };

  /* ========================= TOGGLE INTERESTS ========================== */
  const toggleInterest = (interest) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  /* ========================= MAIN HANDLER ========================== */
  const handleTripCreate = async (e) => {
    e.preventDefault();
    
    if (loading || !user) return;

    try {
      setLoading(true);
      setError(null);

      const budgetCheck = validateBudget(
        destination,
        budget,
        days,
        travelers
      );

      if (!budgetCheck.valid) {
        setError(
          `❌ Budget too low for ${destination}. Minimum required budget is ₹${budgetCheck.minBudget.toLocaleString()}`
        );
        setLoading(false);
        return;
      }

      const perDayBudget = Math.floor((budget || 50000) / (days || 5));
      const perPersonBudget = Math.floor((budget || 50000) / (travelers || 2));

      const prompt = `
Create a realistic ${days}-day travel itinerary.

From: ${from}
Destination: ${destination}
Region: ${budgetCheck.region}
People: ${travelers}

Total Budget: ₹${budget}
Daily Budget: ₹${perDayBudget}
Per Person Budget: ₹${perPersonBudget}

Transport: ${transport}
Interests: ${interests.join(", ")}
Special Requests: ${specialRequests}

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

      const fromCoords = await getCoordinates(from);
      const toCoords = await getCoordinates(destination);

      setRouteCoords({ from: fromCoords, to: toCoords });

      const weatherData = await fetchWeather(destination);
      setWeather(weatherData);

      const destImg = await fetchImage(destination);
      setHeroImage(destImg);

      const places = extractPlaces(text);
      const images = {};
      for (let place of places.slice(0, 6)) {
        images[place] = await fetchImage(place + " " + destination);
      }
      setPlaceImages(images);

      const docRef = await addDoc(collection(db, "trips"), {
        from,
        destination,
        days,
        budget,
        members: travelers,
        transport,
        interests,
        specialRequests,
        userId: user.uid,
        region: budgetCheck.region || "",
        perDayBudget,
        perPersonBudget,
        itinerary: text,
        heroImage: destImg,
        placeImages: images,
        routeCoords: { from: fromCoords, to: toCoords },
        weather: weatherData,
        createdAt: new Date(),
      });

      const url = `${window.location.origin}/trip/${docRef.id}`;
      setShareUrl(url);

      setTrip({ 
        from, 
        destination, 
        days, 
        budget, 
        members: travelers, 
        transport,
        text 
      });
    } catch (err) {
      console.error(err);
      setError("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ========================= UI ========================== */
  return (
    <div className="create-page">
      <div className="create-container">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>

        <div className="create-header">
          <h1 className="create-title">Plan Your Perfect Trip</h1>
          <p className="create-subtitle">
            Share your preferences and let our AI create a personalized itinerary just for you
          </p>
        </div>

        {loading && (
          <div className="loading-message">
            ✨ Generating your personalized itinerary...
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {!loading && !trip && (
          <div className="create-card">
            <form onSubmit={handleTripCreate}>
              {/* AI-Powered Trip Planning Section */}
              <div className="form-section">
                <div className="section-header">
                  <span className="section-icon">✈️</span>
                  <div>
                    <h2 className="section-title">AI-Powered Trip Planning</h2>
                    <p className="section-description">
                      Tell us your preferences and let our AI create the perfect personalized itinerary for you
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    📍 Destination in India
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Rajasthan, Kerala, Goa, Himachal Pradesh..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">💰 Budget per person (₹)</label>
                  <div className="budget-slider-container">
                    <input
                      type="range"
                      className="budget-slider"
                      min="10000"
                      max="200000"
                      step="5000"
                      value={budget || 50000}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setBudget(isNaN(value) ? 50000 : value);
                      }}
                    />
                    <div className="budget-labels">
                      <span className="budget-label">₹10,000</span>
                      <span className="budget-label center">₹{(budget || 50000).toLocaleString()}</span>
                      <span className="budget-label">₹2,00,000</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">👥 Number of Travelers</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    max="20"
                    value={travelers || 2}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setTravelers(isNaN(value) ? 2 : value);
                    }}
                    required
                  />
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">Starting Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Delhi"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Number of Days</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 5"
                      min="1"
                      max="30"
                      value={days || 5}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setDays(isNaN(value) ? 5 : value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mode of Transport</label>
                    <select
                      className="form-select"
                      value={transport}
                      onChange={(e) => setTransport(e.target.value)}
                      required
                    >
                      <option value="Train">Train</option>
                      <option value="Flight">Flight</option>
                      <option value="Car">Car</option>
                      <option value="Bus">Bus</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Interests Section */}
              <div className="form-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Your Interests & Preferences</h2>
                  </div>
                </div>

                <div className="interests-grid">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      className={`interest-tag ${interests.includes(interest) ? 'active' : ''}`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests Section */}
              <div className="form-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Special Requests or Requirements</h2>
                  </div>
                </div>

                <textarea
                  className="form-textarea"
                  placeholder="Any dietary restrictions, accessibility needs, specific experiences you want to include..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                <span>✨</span>
                Generate AI-Powered Itinerary
              </button>
            </form>
          </div>
        )}

        {trip && (
          <div className="result-card" id="trip-result">
            {heroImage && (
              <img
                src={heroImage}
                alt={trip.destination}
                className="hero-image"
              />
            )}

            <div className="trip-overview">
              <h2>🗺️ Your Trip Overview</h2>
              <div className="trip-details">
                <span>📍 {trip.from} → {trip.destination}</span>
                <span>👥 {trip.members} travelers</span>
                <span>🕒 {trip.days} days</span>
                <span>🚆 {trip.transport}</span>
                <span>💰 ₹{(trip.budget || 0).toLocaleString()}</span>
              </div>

              {weather && (
                <p>🌦️ {weather.condition} • {weather.temp}°C</p>
              )}

              <div className="action-buttons">
                <button
                  onClick={exportTripAsPDF}
                  className="btn-primary"
                >
                  📄 Export as PDF
                </button>

                {shareUrl && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      alert("Shareable link copied!");
                    }}
                    className="btn-secondary"
                  >
                    🔗 Copy Share Link
                  </button>
                )}
              </div>

              <div className="itinerary-box">{trip.text}</div>
            </div>

            {/* Route Map Section */}
            {routeCoords && routeCoords.from && routeCoords.to && (
              <div className="map-section">
                <h3 className="map-title">🗺️ Route Map</h3>
                <TripMap
                  from={routeCoords.from}
                  to={routeCoords.to}
                  place={trip.destination}
                />
              </div>
            )}

            {Object.keys(placeImages).length > 0 && (
              <div className="places-gallery">
                <h3>📸 Places You'll Visit</h3>
                <div className="places-grid">
                  {Object.entries(placeImages).map(
                    ([place, img]) =>
                      img && (
                        <div key={place} className="place-card">
                          <img src={img} alt={place} />
                          <p>{place}</p>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateTrip;