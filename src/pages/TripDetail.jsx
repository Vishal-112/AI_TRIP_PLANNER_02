import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

function TripDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const ref = doc(db, "trips", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          navigate("/history");
          return;
        }

        const data = snap.data();

        // 🔐 SECURITY CHECK
        if (data.userId !== user.uid) {
          navigate("/history");
          return;
        }

        setTrip(data);
      } catch (err) {
        console.error(err);
        navigate("/history");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading trip...</p>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="page-container">
      <div style={{ maxWidth: "900px", width: "100%" }}>
        {trip.heroImage && (
          <img
            src={trip.heroImage}
            alt={trip.destination}
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover",
              borderRadius: "18px",
              marginBottom: "25px",
            }}
          />
        )}

        <h2>🗺️ {trip.destination}</h2>

        <p style={{ marginTop: "6px", color: "#cbd5f5" }}>
          {trip.from} → {trip.destination}
        </p>

        <p style={{ fontSize: "14px", marginTop: "6px" }}>
          👥 {trip.members} • 🕒 {trip.days} days • 🚆 {trip.transport}
        </p>

        <p style={{ marginTop: "6px" }}>💰 ₹{trip.budget}</p>

        <div className="itinerary-box" style={{ marginTop: "20px" }}>
          {trip.itinerary}
        </div>

        {trip.placeImages && (
          <>
            <h3 style={{ marginTop: "30px" }}>📸 Places You’ll Visit</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              {Object.entries(trip.placeImages).map(
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
    </div>
  );
}

export default TripDetail;
