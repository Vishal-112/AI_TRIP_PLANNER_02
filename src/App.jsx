import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateTrip from "./pages/CreateTrip";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ViewTrip from "./pages/ViewTrip"; // 🔥 ADD THIS
import Navbar from "./components/Navbar";

/* 🔒 Protected Route */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const { user } = useAuth();

  return (
    <>
      {/* 🧭 Navbar only after login */}
      {user && <Navbar />}

      <Routes>
        {/* 🌍 Landing */}
        <Route
          path="/"
          element={user ? <Navigate to="/create" /> : <Home />}
        />

        {/* 🔐 Login */}
        <Route
          path="/login"
          element={user ? <Navigate to="/create" /> : <Login />}
        />

        {/* 🔒 Protected Pages */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        {/* 🔥 THIS FIXES OPEN BUTTON */}
        <Route
          path="/trip/:tripId"
          element={
            <ProtectedRoute>
              <ViewTrip />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ❌ Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
