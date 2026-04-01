import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();
  const [totalTrips, setTotalTrips] = useState(0);
  const [lastTrip, setLastTrip] = useState(null);
  const [totalBudget, setTotalBudget] = useState(0);
  const [favoriteDestination, setFavoriteDestination] = useState(null);
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
        const trips = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setTotalTrips(trips.length);

        if (trips.length > 0) {
          setLastTrip(trips[0]);

          // Calculate total budget
          const budget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
          setTotalBudget(budget);

          // Find favorite destination (most visited)
          const destinations = trips.map(t => t.destination);
          const frequency = {};
          destinations.forEach(dest => {
            frequency[dest] = (frequency[dest] || 0) + 1;
          });
          const favorite = Object.keys(frequency).reduce((a, b) => 
            frequency[a] > frequency[b] ? a : b
          );
          setFavoriteDestination(favorite);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getMemberSince = () => {
    if (!user?.metadata?.creationTime) return "Unknown";
    const date = new Date(user.metadata.creationTime);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="page-container">
      <div className="profile-container">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>

        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">
              {user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-badge">Member since {getMemberSince()}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading profile...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-circle">📊</div>
                <div className="stat-content">
                  <span className="stat-value">{totalTrips}</span>
                  <span className="stat-label">Total Trips</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-circle">💰</div>
                <div className="stat-content">
                  <span className="stat-value">₹{totalBudget.toLocaleString()}</span>
                  <span className="stat-label">Total Budget</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-circle">🌟</div>
                <div className="stat-content">
                  <span className="stat-value">
                    {favoriteDestination || "None"}
                  </span>
                  <span className="stat-label">Favorite Destination</span>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="profile-card">
              <h2 className="section-title">📋 Profile Information</h2>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{user?.email}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Account Created</span>
                  <span className="info-value">
                    {formatDate(user?.metadata?.creationTime)}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">User ID</span>
                  <span className="info-value info-value-small">{user?.uid}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Account Status</span>
                  <span className="status-badge">
                    ✓ Active
                  </span>
                </div>
              </div>
            </div>

            {/* Last Trip */}
            {lastTrip && (
              <div className="profile-card">
                <h2 className="section-title">🗺️ Last Trip</h2>
                
                <div className="last-trip-container">
                  {lastTrip.heroImage && (
                    <div className="last-trip-image">
                      <img src={lastTrip.heroImage} alt={lastTrip.destination} />
                    </div>
                  )}
                  
                  <div className="last-trip-info">
                    <h3 className="last-trip-destination">{lastTrip.destination}</h3>
                    <p className="last-trip-route">
                      📍 {lastTrip.from} → {lastTrip.destination}
                    </p>
                    
                    <div className="last-trip-details">
                      <span className="trip-detail">
                        <span className="detail-icon">👥</span>
                        {lastTrip.members} travelers
                      </span>
                      <span className="trip-detail">
                        <span className="detail-icon">📅</span>
                        {lastTrip.days} days
                      </span>
                      <span className="trip-detail">
                        <span className="detail-icon">💰</span>
                        ₹{lastTrip.budget?.toLocaleString()}
                      </span>
                    </div>

                    <Link to="/history" className="view-all-btn">
                      View All Trips →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="profile-card">
              <h2 className="section-title">⚡ Quick Actions</h2>
              
              <div className="actions-grid">
                <Link to="/create" className="action-card">
                  <span className="action-icon">✈️</span>
                  <span className="action-text">Plan New Trip</span>
                </Link>

                <Link to="/history" className="action-card">
                  <span className="action-icon">📜</span>
                  <span className="action-text">View History</span>
                </Link>

                <Link to="/settings" className="action-card">
                  <span className="action-icon">⚙️</span>
                  <span className="action-text">Settings</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;