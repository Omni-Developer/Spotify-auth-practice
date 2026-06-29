import React, { createContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const register = async (username, email, password, role = "listener") => {
    setError(null);
    const result = await authAPI.register(username, email, password, role);

    if (result.success) {
      const { token: newToken, user: newUser } = result.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true };
    }

    setError(result.error);
    return { success: false, error: result.error };
  };

  const login = async (email, password) => {
    setError(null);
    const result = await authAPI.login(email, password);

    if (result.success) {
      const { token: newToken, user: newUser } = result.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true };
    }

    setError(result.error);
    return { success: false, error: result.error };
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    setUser,
    isAuthenticated: !!token,
    isArtist: user?.role === "artist",
    isListener: user?.role === "listener",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
