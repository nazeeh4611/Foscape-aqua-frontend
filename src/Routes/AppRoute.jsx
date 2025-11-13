import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from './UserRoute';
import AdminRoute from './AdminRoutes';

function AppRoute() {
  return (
   <>
    <Router>
      <Routes>
      <Route path="/*" element={<UserRoute />} />
      <Route path="/admin/*" element={<AdminRoute />} />
     </Routes>
    </Router>
   </>
  )
}

export default AppRoute