import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Add this import
import "./Home.css";

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth(); // Get user state

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Planning",
      description: "Let our advanced AI create personalized itineraries based on your preferences, budget, and travel style."
    },
    {
      icon: "💰",
      title: "Smart Budget Management",
      description: "Get realistic trip plans that fit your budget with detailed cost breakdowns for accommodation, food, and activities."
    },
    {
      icon: "🗺️",
      title: "Interactive Maps",
      description: "Visualize your journey with beautiful maps showing routes, destinations, and points of interest."
    },
    {
      icon: "🌤️",
      title: "Real-Time Weather",
      description: "Get current weather information for your destination to pack appropriately and plan activities."
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Access your trips on any device - desktop, tablet, or mobile. Plan on the go!"
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your travel plans are stored securely with Firebase. Your data is always private and protected."
    }
  ];

  const stats = [
    { number: "10K+", label: "Trips Planned" },
    { number: "5K+", label: "Happy Travelers" },
    { number: "50+", label: "Destinations" },
    { number: "4.8/5", label: "User Rating" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      avatar: "👩",
      rating: 5,
      text: "Best trip planning tool I've ever used! The AI suggestions were spot-on and saved me hours of research."
    },
    {
      name: "Rahul Verma",
      location: "Delhi",
      avatar: "👨",
      rating: 5,
      text: "Amazing experience! The budget breakdown helped me plan a perfect Goa trip within my means."
    },
    {
      name: "Ananya Patel",
      location: "Bangalore",
      avatar: "👩",
      rating: 5,
      text: "The interactive maps and weather updates made our Himachal trip so much easier to plan. Highly recommend!"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Enter Your Details",
      description: "Tell us your destination, budget, travel dates, and preferences."
    },
    {
      step: "2",
      title: "AI Creates Your Plan",
      description: "Our AI analyzes your inputs and generates a personalized itinerary in seconds."
    },
    {
      step: "3",
      title: "Customize & Explore",
      description: "Review your plan, see it on the map, and make any adjustments you want."
    },
    {
      step: "4",
      title: "Save & Share",
      description: "Save your trip, export as PDF, or share the link with your travel companions."
    }
  ];

  return (
    <div className="home">
      {/* Navbar */}
      <nav className={`home-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">✈️</span>
            <span className="logo-text">AI Trip Planner</span>
          </Link>
          <div className="nav-links">
            {!user ? (
              <>
                <a href="#features">Features</a>
                <a href="#how-it-works">How it Works</a>
                <a href="#testimonials">Reviews</a>
                <Link to="/login" className="nav-btn-login">Sign In</Link>
                <Link to="/create" className="nav-btn-primary">Plan Trip</Link>
              </>
            ) : (
              <>
                <Link to="/create">Create Trip</Link>
                <Link to="/history">History</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/settings">Settings</Link>
                <Link to="/create" className="nav-btn-primary">Plan Trip</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>Powered by Advanced AI</span>
            </div>
            <h1 className="hero-title">
              Plan Your Perfect Trip with
              <span className="gradient-text"> AI Intelligence</span>
            </h1>
            <p className="hero-description">
              Stop spending hours researching. Let our AI create personalized travel itineraries 
              that match your budget, interests, and style in seconds.
            </p>
            <div className="hero-buttons">
              <Link to="/create" className="btn-hero-primary">
                Start Planning Free
                <span className="btn-arrow">→</span>
              </Link>
              <a href="#how-it-works" className="btn-hero-secondary">
                <span className="play-icon">▶</span>
                See How it Works
              </a>
            </div>
            <div className="hero-trust">
              <div className="trust-avatars">
                <span className="avatar">👨</span>
                <span className="avatar">👩</span>
                <span className="avatar">👨</span>
                <span className="avatar">👩</span>
              </div>
              <div className="trust-text">
                <strong>5,000+ travelers</strong> have planned their trips with us
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card card-1">
              <div className="card-header">
                <span className="card-icon">🗺️</span>
                <span className="card-title">Your Itinerary</span>
              </div>
              <div className="card-content">
                <div className="itinerary-item">
                  <span className="time">9:00 AM</span>
                  <span className="activity">Visit Amber Fort</span>
                </div>
                <div className="itinerary-item">
                  <span className="time">1:00 PM</span>
                  <span className="activity">Lunch at Chokhi Dhani</span>
                </div>
                <div className="itinerary-item">
                  <span className="time">4:00 PM</span>
                  <span className="activity">City Palace Tour</span>
                </div>
              </div>
            </div>
            <div className="visual-card card-2">
              <div className="budget-display">
                <span className="budget-label">Total Budget</span>
                <span className="budget-amount">₹45,000</span>
              </div>
              <div className="budget-breakdown">
                <div className="breakdown-item">
                  <span>🏨 Stay</span>
                  <span>₹15,000</span>
                </div>
                <div className="breakdown-item">
                  <span>🍽️ Food</span>
                  <span>₹12,000</span>
                </div>
                <div className="breakdown-item">
                  <span>🎭 Activities</span>
                  <span>₹18,000</span>
                </div>
              </div>
            </div>
            <div className="visual-card card-3">
              <div className="weather-display">
                <span className="weather-icon">☀️</span>
                <span className="weather-temp">28°C</span>
                <span className="weather-desc">Sunny</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything You Need to Plan</h2>
            <p className="section-description">
              Powerful features designed to make trip planning effortless
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Plan Your Trip in 4 Simple Steps</h2>
            <p className="section-description">
              From idea to itinerary in minutes
            </p>
          </div>
          <div className="steps-grid">
            {howItWorks.map((item, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2 className="section-title">Loved by Travelers</h2>
            <p className="section-description">
              See what our users have to say
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <span className="author-avatar">{testimonial.avatar}</span>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-location">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Adventure?</h2>
            <p className="cta-description">
              Join thousands of travelers who trust AI Trip Planner for their journeys
            </p>
            <Link to="/create" className="cta-button">
              Plan Your Trip Now
              <span className="btn-arrow">→</span>
            </Link>
            <p className="cta-note">✨ No credit card required • Free to start</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">✈️</span>
                <span className="logo-text">AI Trip Planner</span>
              </div>
              <p className="footer-tagline">
                Plan smarter, travel better with AI-powered itineraries
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <Link to="/create">Plan Trip</Link>
                <Link to="/history">My Trips</Link>
                <a href="#features">Features</a>
                <a href="#how-it-works">How it Works</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="#contact">Contact</a>
                <a href="#blog">Blog</a>
                <a href="#careers">Careers</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#faq">FAQ</a>
                <Link to="/settings">Settings</Link>
                <a href="#privacy">Privacy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 AI Trip Planner. All rights reserved.</p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;