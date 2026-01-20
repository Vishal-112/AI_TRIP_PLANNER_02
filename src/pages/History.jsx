import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function History() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTrips = async () => {
      try {
        const q = query(
          collection(db, "trips"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTrips(data);
      } catch (err) {
        console.error("History error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  const handleDelete = async (tripId) => {
    if (!window.confirm("Delete this trip?")) return;

    try {
      await deleteDoc(doc(db, "trips", tripId));
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: "1100px", width: "100%" }}>
        <h2 style={{ marginBottom: "20px" }}>🕘 Trip History</h2>

        {loading && <p>Loading...</p>}

        {!loading && trips.length === 0 && (
          <p style={{ color: "#94a3b8" }}>No trips found.</p>
        )}

        <div className="history-grid">
          {trips.map((trip) => (
            <div key={trip.id} className="history-card">
              {trip.heroImage && (
                <img
                  src={trip.heroImage}
                  alt={trip.destination}
                  className="history-img"
                />
              )}

              <h4>{trip.destination}</h4>

              <p style={{ fontSize: "13px" }}>
                {trip.from} → {trip.destination}
              </p>

              <p style={{ fontSize: "12px" }}>
                👥 {trip.members} • 🕒 {trip.days} days
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                {/* 🔥 OPEN BUTTON */}
                <button
                  className="settings-btn"
                  onClick={() => navigate(`/trip/${trip.id}`)}
                >
                  Open
                </button>

                <button
                  className="settings-btn danger"
                  onClick={() => handleDelete(trip.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;
