import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../Components/User/HomePage";

function UserRoute() {
  return (
    <>
    <Routes>
        <Route path="/" element={<HomePage/>} />
    </Routes>
    </>
  )
}

export default UserRoute