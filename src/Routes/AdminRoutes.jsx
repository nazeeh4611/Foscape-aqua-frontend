import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "../Components/Admin/Sidebar";
import AdminCategoryPage from "../Components/Admin/Category";
import AdminSubCategoryPage from "../Components/Admin/SubCategory";
import AquariumProductsPage from "../Components/Admin/Products";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="lg:hidden p-4 bg-white shadow-sm">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function AdminRoute() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="categories/main" replace />} />
        <Route path="categories/main" element={<AdminCategoryPage />} />
        <Route path="categories/sub" element={<AdminSubCategoryPage />} />
        <Route path="products" element={<AquariumProductsPage />} />
      </Route>
    </Routes>
  );
}

export default AdminRoute;