import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../Base/Base";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const checkAuthStatus = async () => {
    try {
      setIsCheckingAuth(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setIsLogged(false);
        localStorage.removeItem("userData");
        return null;
      }

      const response = await axios.get(`${baseurl}user/get-user`);

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        setIsLogged(true);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        setUser(null);
        setIsLogged(false);
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        return null;
      }
    } catch (error) {
      setUser(null);
      setIsLogged(false);
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      return null;
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsLogged(true);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLogged(false);
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{ user, isLogged, isCheckingAuth, checkAuthStatus, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);