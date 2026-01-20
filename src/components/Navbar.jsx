import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 🔒 Login page par navbar hide
  if (!user) return null;

  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <span
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/create-trip")}
        >
          ✈️ AI Trip Planner
        </span>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        {/* ✅ ROUTES MUST MATCH App.jsx */}
        <Link to="/create-trip">Create Trip</Link>
        <Link to="/history">History</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/settings">Settings</Link>

        <div className="user-box">
          <span className="user-email">{user.email}</span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
