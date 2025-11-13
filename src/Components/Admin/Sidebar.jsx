import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Package,
  ShoppingBag,
  Users,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isSubOpen, setIsSubOpen] = useState(false);

  const toggleSubmenu = () => setIsSubOpen(!isSubOpen);

  const isActive = (path) => location.pathname === path;

  React.useEffect(() => {
    if (location.pathname.startsWith("/admin/categories")) {
      setIsSubOpen(true);
    }
  }, [location.pathname]);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col h-screen`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={toggleSubmenu}
                className={`flex items-center justify-between w-full p-3 rounded-lg transition ${
                  location.pathname.startsWith("/admin/categories")
                    ? "bg-gray-800 text-white"
                    : "bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center">
                  <LayoutGrid className="w-5 h-5" />
                  <span className="ml-3">Categories</span>
                </div>
                {isSubOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {isSubOpen && (
                <ul className="mt-2 ml-8 space-y-1">
                  <li>
                    <Link
                      to="/admin/categories/main"
                      onClick={handleLinkClick}
                      className={`block p-2 rounded transition ${
                        isActive("/admin/categories/main")
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      Main Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/categories/sub"
                      onClick={handleLinkClick}
                      className={`block p-2 rounded transition ${
                        isActive("/admin/categories/sub")
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      Sub Category
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/admin/products"
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-lg transition ${
                  isActive("/admin/products")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="ml-3">Products</span>
              </Link>
            </li>

            <li>
              <Link
                to="/orders"
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-lg transition ${
                  isActive("/orders")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="ml-3">Orders</span>
              </Link>
            </li>

            <li>
              <Link
                to="/users"
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-lg transition ${
                  isActive("/users")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="ml-3">Users</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center justify-center w-full p-3 rounded-lg bg-red-600 hover:bg-red-700 transition">
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;