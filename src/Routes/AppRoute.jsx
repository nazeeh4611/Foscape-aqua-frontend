import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from './UserRoute';

function AppRoute() {
  return (
   <>
    <Router>
      <Routes>
      <Route path="/*" element={<UserRoute />} />
     </Routes>
    </Router>
   </>
  )
}

export default AppRoute