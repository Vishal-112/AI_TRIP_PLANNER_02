import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, deleteUser } from "firebase/auth";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebase/firebase";

function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  if (!user) return null;

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMsg("✅ Password reset email sent.");
      setErr("");
    } catch {
      setErr("❌ Failed to send reset email.");
      setMsg("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠️ Delete account permanently?")) return;

    try {
      await deleteUser(user);
      navigate("/login");
    } catch {
      setErr("❌ Please re-login to delete your account.");
      setMsg("");
    }
  };

  return (
    <div className="page-container">
      <div className="settings-card">
        <h2 className="settings-title">⚙️ Settings</h2>

        <div className="settings-grid">

          {/* EMAIL */}
          <div className="settings-block">
            <span className="label">EMAIL</span>
            <span className="value">{user.email}</span>
          </div>

          {/* PASSWORD */}
          <div className="settings-block">
            <span className="label">PASSWORD</span>
            <button className="settings-btn" onClick={handleResetPassword}>
              Reset Password
            </button>
          </div>

          {/* THEME */}
          <div className="settings-block">
            <span className="label">THEME</span>
            <button className="settings-btn" onClick={toggleTheme}>
              Switch to {theme === "dark" ? "Light" : "Dark"} Mode
            </button>
          </div>

          {/* SESSION */}
          <div className="settings-block">
            <span className="label">SESSION</span>
            <button className="settings-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* DANGER ZONE */}
          <div className="settings-block danger">
            <span className="label">DANGER ZONE</span>
            <button className="settings-btn danger" onClick={handleDelete}>
              Delete Account
            </button>
          </div>
        </div>

        {msg && <p className="settings-success">{msg}</p>}
        {err && <p className="settings-error">{err}</p>}
      </div>
    </div>
  );
}

export default Settings;
