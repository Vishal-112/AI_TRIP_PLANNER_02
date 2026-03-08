import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      } else {
        // Sign up
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error("Auth error:", err);
      
      // Better error messages
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Please login instead.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess("Signed in with Google successfully! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Google sign-in error:", err);
      
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Pop-up blocked. Please allow pop-ups and try again.");
      } else {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess("Signed in with Facebook successfully! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Facebook sign-in error:", err);
      
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Pop-up blocked. Please allow pop-ups and try again.");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with the same email. Please use a different sign-in method.");
      } else {
        setError("Failed to sign in with Facebook. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <h1 className="branding-title">
              ✈️ AI Trip Planner
            </h1>
            <p className="branding-subtitle">
              Plan your perfect journey with AI-powered itineraries
            </p>
            
            <div className="branding-features">
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <div className="feature-text">
                  <h3>AI-Powered Planning</h3>
                  <p>Smart itineraries based on your preferences</p>
                </div>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">💰</span>
                <div className="feature-text">
                  <h3>Budget Management</h3>
                  <p>Stay within your budget with smart suggestions</p>
                </div>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">🗺️</span>
                <div className="feature-text">
                  <h3>Interactive Maps</h3>
                  <p>Visualize your journey with detailed routes</p>
                </div>
              </div>
            </div>

            <div className="branding-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Trips Planned</span>
              </div>
              <div className="stat">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Happy Travelers</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Destinations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h2 className="auth-title">
                {isLogin ? "Welcome Back!" : "Create Account"}
              </h2>
              <p className="auth-subtitle">
                {isLogin 
                  ? "Sign in to continue your journey" 
                  : "Start planning your perfect trip today"}
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span className="alert-text">{error}</span>
                <button className="alert-close" onClick={clearMessages}>×</button>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✓</span>
                <span className="alert-text">{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🔒</span>
                    Confirm Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="form-extras">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-link">
                    Forgot password?
                  </a>
                </div>
              )}

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode */}
            <div className="auth-switch">
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button" 
                  className="switch-btn" 
                  onClick={switchMode}
                  disabled={loading}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="divider">
              <span>or continue with</span>
            </div>

            {/* Social Login Buttons */}
            <div className="social-buttons">
              <button 
                type="button" 
                className="social-btn google-btn" 
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button 
                type="button" 
                className="social-btn facebook-btn" 
                onClick={handleFacebookSignIn}
                disabled={loading}
              >
                <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Back to Home */}
            <div className="auth-footer">
              <Link to="/" className="back-home-link">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;