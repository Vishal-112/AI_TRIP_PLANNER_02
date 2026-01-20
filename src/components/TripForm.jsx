import { useState } from "react";

function TripForm({ onSubmit }) {
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [members, setMembers] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [transport, setTransport] = useState("Train");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      from,
      destination,
      members: Number(members),
      days: Number(days),
      budget: Number(budget),
      transport,
    });
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      {/* Starting Location */}
      <label className="input-label">Starting Location</label>
      <input
        className="trip-input"
        placeholder="e.g. Delhi"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        required
      />

      {/* Destination */}
      <label className="input-label">Destination</label>
      <input
        className="trip-input"
        placeholder="e.g. Manali"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      />

      {/* People & Days */}
      <div className="row">
        <div>
          <label className="input-label">Number of People</label>
          <input
            className="trip-input"
            type="number"
            min="1"
            placeholder="e.g. 2"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="input-label">Number of Days</label>
          <input
            className="trip-input"
            type="number"
            min="1"
            placeholder="e.g. 5"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Budget */}
      <label className="input-label">Total Budget (₹)</label>
      <input
        className="trip-input"
        type="number"
        placeholder="e.g. 15000"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        required
      />

      {/* Transport */}
      <label className="input-label">Mode of Transport</label>
      <select
        className="trip-select"
        value={transport}
        onChange={(e) => setTransport(e.target.value)}
      >
        <option>Train</option>
        <option>Bus</option>
        <option>Flight</option>
        <option>Car</option>
      </select>

      <button className="trip-btn">🚀 Generate Trip</button>
    </form>
  );
}

export default TripForm;
