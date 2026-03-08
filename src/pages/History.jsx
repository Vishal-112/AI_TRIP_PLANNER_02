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
import { useNavigate, Link } from "react-router-dom";
import "./History.css";

function History() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

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
    if (!window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) return;

    setDeleteLoading(tripId);
    try {
      await deleteDoc(doc(db, "trips", tripId));
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete trip. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="page-container">
      <div className="history-container">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>

        <div className="history-header">
          <h1 className="history-title">🗺️ Trip History</h1>
          <p className="history-subtitle">
            View and manage all your past trip plans
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✈️</div>
            <h3 className="empty-state-title">No trips yet</h3>
            <p className="empty-state-text">
              Start planning your first adventure with AI
            </p>
            <Link to="/create" className="empty-state-btn">
              Create Your First Trip
            </Link>
          </div>
        ) : (
          <>
            <div className="trips-stats">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <span className="stat-value">{trips.length}</span>
                  <span className="stat-label">Total Trips</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🌍</div>
                <div className="stat-info">
                  <span className="stat-value">
                    {new Set(trips.map(t => t.destination)).size}
                  </span>
                  <span className="stat-label">Destinations</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <span className="stat-value">
                    ₹{trips.reduce((sum, t) => sum + (t.budget || 0), 0).toLocaleString()}
                  </span>
                  <span className="stat-label">Total Budget</span>
                </div>
              </div>
            </div>

            <div className="history-grid">
              {trips.map((trip) => (
                <div key={trip.id} className="history-card">
                  {trip.heroImage ? (
                    <div className="card-image-container">
                      <img
                        src={trip.heroImage}
                        alt={trip.destination}
                        className="card-image"
                      />
                      <div className="card-overlay"></div>
                    </div>
                  ) : (
                    <div className="card-placeholder">
                      <span className="placeholder-icon">🗺️</span>
                    </div>
                  )}

                  <div className="card-content">
                    <h3 className="card-title">{trip.destination}</h3>
                    
                    <div className="card-route">
                      <span className="route-text">
                        📍 {trip.from} → {trip.destination}
                      </span>
                    </div>

                    <div className="card-details">
                      <div className="detail-item">
                        <span className="detail-icon">👥</span>
                        <span className="detail-text">{trip.members} travelers</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span className="detail-text">{trip.days} days</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🚆</span>
                        <span className="detail-text">{trip.transport}</span>
                      </div>
                    </div>

                    <div className="card-budget">
                      <span className="budget-label">Budget</span>
                      <span className="budget-value">₹{trip.budget?.toLocaleString()}</span>
                    </div>

                    {trip.createdAt && (
                      <div className="card-date">
                        Created on {formatDate(trip.createdAt)}
                      </div>
                    )}

                    <div className="card-actions">
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/trip/${trip.id}`)}
                      >
                        <span className="btn-icon">👁️</span>
                        View Trip
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(trip.id)}
                        disabled={deleteLoading === trip.id}
                      >
                        {deleteLoading === trip.id ? (
                          <>
                            <span className="btn-icon">⏳</span>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <span className="btn-icon">🗑️</span>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default History;