import { useState } from "react";

function TripForm({ onSubmit }) {
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [members, setMembers] = useState(1);
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(5000);
  const [transport, setTransport] = useState("Train");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ from, destination, members, days, budget, transport });
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <h1>Starting Location</h1>
      <input
        className="trip-input"
        placeholder="Starting Location"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        required
      />

      <input
        className="trip-input"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      />

      <div className="row">
        <input
          className="trip-input"
          type="number"
          min="1"
          placeholder="Members"
          value={members}
          onChange={(e) => setMembers(+e.target.value)}
        />

        <input
          className="trip-input"
          type="number"
          min="1"
          placeholder="Days"
          value={days}
          onChange={(e) => setDays(+e.target.value)}
        />
      </div>

      <input
        className="trip-input"
        type="number"
        min="500"
        placeholder="Budget (₹)"
        value={budget}
        onChange={(e) => setBudget(+e.target.value)}
      />
   
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
