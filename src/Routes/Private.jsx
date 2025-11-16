import React from "react"
import { Navigate } from "react-router-dom"


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("Atoken")
  return token ? children : <Navigate to="/admin/login" replace />
}

export default PrivateRoute




export const UserPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

