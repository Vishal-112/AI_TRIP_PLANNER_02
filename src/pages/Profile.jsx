import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [totalTrips, setTotalTrips] = useState(0);
  const [lastTrip, setLastTrip] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      const q = query(
        collection(db, "trips"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const trips = snapshot.docs.map((doc) => doc.data());

      setTotalTrips(trips.length);
      if (trips.length > 0) {
        setLastTrip(trips[trips.length - 1]);
      }
    };

    fetchTrips();
  }, [user]);

  return (
    <div className="page-container">
      <div className="profile-card">
        <h2 className="profile-title">👤 Profile</h2>

        <div className="profile-grid">

          <div className="profile-block">
            <span className="label">Email</span>
            <span className="value">{user.email}</span>
          </div>

          <div className="profile-block">
            <span className="label">Account Created</span>
            <span className="value">
              {new Date(user.metadata.creationTime).toDateString()}
            </span>
          </div>

          <div className="profile-block">
            <span className="label">Total Trips Planned</span>
            <span className="value">{totalTrips}</span>
          </div>

          <div className="profile-block">
            <span className="label">Last Trip Destination</span>
            <span className="value">
              {lastTrip ? lastTrip.destination : "—"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
