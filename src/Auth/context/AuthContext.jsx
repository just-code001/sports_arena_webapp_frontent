import { createContext, useState, useEffect } from "react";
import { getToken, getUserRole, decodeToken } from "../JwtUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [userRole, setUserRole] = useState(getUserRole());
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Keep session alive after page reload
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      setUserRole(getUserRole());
      const decoded = decodeToken(token);
      setUser(decoded);
    }
  }, []);

  const login = (token) => {
    sessionStorage.setItem("token", token);
    const decoded = decodeToken(token);
    sessionStorage.setItem("user", JSON.stringify(decoded));
    setIsAuthenticated(true);
    setUser(decoded);
    setUserRole(getUserRole());
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
