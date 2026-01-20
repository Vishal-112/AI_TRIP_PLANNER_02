import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const ref = doc(db, "trips", tripId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setTrip(snap.data());
        }
      } catch (err) {
        console.error("Trip load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (loading) return <p style={{ padding: "40px" }}>Loading trip...</p>;

  if (!trip)
    return <p style={{ padding: "40px" }}>Trip not found.</p>;

  return (
    <div className="page-container">
      <div style={{ maxWidth: "900px", width: "100%" }}>
        <h2>{trip.destination}</h2>

        {trip.heroImage && (
          <img
            src={trip.heroImage}
            alt={trip.destination}
            style={{
              width: "100%",
              borderRadius: "16px",
              margin: "20px 0",
            }}
          />
        )}

        <p>
          <strong>Route:</strong> {trip.from} → {trip.destination}
        </p>
        <p>
          <strong>Members:</strong> {trip.members}
        </p>
        <p>
          <strong>Days:</strong> {trip.days}
        </p>

        <hr style={{ margin: "20px 0", opacity: 0.2 }} />

        <pre className="itinerary-box">{trip.itinerary}</pre>
      </div>
    </div>
  );
}

export default ViewTrip;
