import React from "react";
import Navbar from "../Layout/Navbar";

function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default UserLayout;