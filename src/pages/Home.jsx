import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="landing">

      {/* ===== NAVBAR ===== */}
      <nav className="navbar">
        <div className="logo">✈️ AI Trip Planner</div>
        <Link to="/create" className="nav-btn">
          Create Trip
        </Link>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Plan Smarter Trips <br />
            <span>With AI Intelligence</span>
          </h1>

          <p>
            Design personalized, budget-friendly and unforgettable journeys
            using artificial intelligence — faster than ever.
          </p>

          <div className="hero-actions">
            <Link to="/create" className="primary-btn">
              ✈️ Start Planning
            </Link>
            <Link to="/create" className="secondary-btn">
              View Demo
            </Link>
          </div>
        </div>

        {/* ===== IMAGE COLLAGE ===== */}
        <div className="hero-images">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Beach"
            className="img img1"
          />
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            alt="Mountains"
            className="img img2"
          />
          <img
            src="https://images.unsplash.com/photo-1491553895911-0055eca6402d"
            alt="City"
            className="img img3"
          />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features">
        <h2>Why Choose AI Trip Planner?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>🌍 Smart Destinations</h3>
            <p>
              AI analyzes season, interests and trends to suggest
              the perfect destinations.
            </p>
          </div>

          <div className="feature-card">
            <h3>💰 Budget Optimization</h3>
            <p>
              Intelligent planning that balances cost,
              comfort and experiences.
            </p>
          </div>

          <div className="feature-card">
            <h3>🧠 AI-Generated Itineraries</h3>
            <p>
              Real-world travel logic, not random suggestions.
            </p>
          </div>

          <div className="feature-card">
            <h3>⚡ Instant Planning</h3>
            <p>
              Complete trip plan generated within seconds.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta">
        <h2>Ready to Build Your Next Journey?</h2>
        <p>No manual planning. No confusion. Just smart travel.</p>
        <Link to="/create" className="primary-btn">
          🚀 Create My Trip
        </Link>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        © 2026 AI Trip Planner • Built by Vishal Yadav 🚀
      </footer>

    </div>
  );
}

export default Home;
