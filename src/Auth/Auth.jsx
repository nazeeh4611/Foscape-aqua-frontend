import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../Base/Base";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(`${baseurl}user/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (res.data.success) {
        setUser(res.data.user);
        setIsLogged(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("token");
      setUser(null);
      setIsLogged(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLogged(false);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLogged, loading, checkAuthStatus, logout, setUser, setIsLogged }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};