import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from './UserRoute';
import AdminRoute from './AdminRoutes';
import ScrollToTop from "../ScrolltoTop";
import { ToastProvider } from "../Context.js/ToastContext"; // Import ToastProvider

function AppRoute() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <ToastProvider> 
          <Routes>
            <Route path="/*" element={<UserRoute />} />
            <Route path="/admin/*" element={<AdminRoute />} />
          </Routes>
        </ToastProvider>
    </Router>
    </>
  )
}

export default AppRoute