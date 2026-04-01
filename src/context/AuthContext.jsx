import { createContext, useEffect, useState, useContext } from "react";
import {
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

export { AuthContext };

// ✅ ADD THIS (main fix)
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });

        return unsubscribe;
      })
      .catch((error) => {
        console.error("Auth persistence error:", error);
        setLoading(false);
      });
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};