import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebase/firebase";
import "./Settings.css";

function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleResetPassword = async () => {
    setLoading(true);
    setMsg("");
    setErr("");

    try {
      await sendPasswordResetEmail(auth, user.email);
      setMsg("✅ Password reset email sent successfully! Please check your inbox.");
    } catch (error) {
      console.error("Reset password error:", error);
      setErr("❌ Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setErr("❌ Failed to logout. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete your account permanently? This action cannot be undone and all your trip data will be lost."
    );
    
    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      "⚠️ Final confirmation: Delete account and all data?"
    );

    if (!doubleConfirm) return;

    setLoading(true);
    setMsg("");
    setErr("");

    try {
      await deleteUser(user);
      navigate("/login");
    } catch (error) {
      console.error("Delete account error:", error);
      setErr("❌ Failed to delete account. Please re-login and try again.");
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMsg("");
    setErr("");
  };

  return (
    <div className="page-container">
      <div className="settings-container">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>

        <div className="settings-header">
          <h1 className="settings-title">⚙️ Settings</h1>
          <p className="settings-subtitle">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Notifications */}
        {msg && (
          <div className="alert alert-success">
            <span className="alert-icon">✅</span>
            <span className="alert-text">{msg}</span>
            <button className="alert-close" onClick={clearMessages}>×</button>
          </div>
        )}

        {err && (
          <div className="alert alert-error">
            <span className="alert-icon">❌</span>
            <span className="alert-text">{err}</span>
            <button className="alert-close" onClick={clearMessages}>×</button>
          </div>
        )}

        {/* Account Information */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="card-title">👤 Account Information</h2>
            <p className="card-subtitle">Your basic account details</p>
          </div>

          <div className="settings-section">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Email Address</span>
                <span className="setting-value">{user.email}</span>
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">User ID</span>
                <span className="setting-value setting-value-small">{user.uid}</span>
              </div>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Account Created</span>
                <span className="setting-value">
                  {new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="card-title">🔒 Security</h2>
            <p className="card-subtitle">Manage your password and account security</p>
          </div>

          <div className="settings-section">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Password</span>
                <span className="setting-description">
                  Reset your account password
                </span>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="card-title">🎨 Appearance</h2>
            <p className="card-subtitle">Customize how the app looks</p>
          </div>

          <div className="settings-section">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Theme</span>
                <span className="setting-description">
                  Current theme: <strong>{theme === "dark" ? "Dark" : "Light"}</strong> Mode
                </span>
              </div>
              <button className="btn btn-secondary" onClick={toggleTheme}>
                Switch to {theme === "dark" ? "Light" : "Dark"} Mode
              </button>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="card-title">🔐 Session</h2>
            <p className="card-subtitle">Manage your login session</p>
          </div>

          <div className="settings-section">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Current Session</span>
                <span className="setting-description">
                  Sign out from your account on this device
                </span>
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-card danger-card">
          <div className="card-header">
            <h2 className="card-title">⚠️ Danger Zone</h2>
            <p className="card-subtitle">Irreversible and destructive actions</p>
          </div>

          <div className="settings-section">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-label">Delete Account</span>
                <span className="setting-description">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </span>
              </div>
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Processing..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="settings-card">
          <div className="card-header">
            <h2 className="card-title">❓ Help & Support</h2>
            <p className="card-subtitle">Get help or provide feedback</p>
          </div>

          <div className="help-links">
            <a href="mailto:support@aitripplanner.com" className="help-link">
              <span className="help-icon">📧</span>
              <div className="help-info">
                <span className="help-title">Contact Support</span>
                <span className="help-desc">Get help with your account</span>
              </div>
            </a>

            <a href="#" className="help-link">
              <span className="help-icon">📚</span>
              <div className="help-info">
                <span className="help-title">Documentation</span>
                <span className="help-desc">Learn how to use the app</span>
              </div>
            </a>

            <a href="#" className="help-link">
              <span className="help-icon">💬</span>
              <div className="help-info">
                <span className="help-title">Send Feedback</span>
                <span className="help-desc">Help us improve</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;