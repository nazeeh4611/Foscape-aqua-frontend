import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Package,
  ShoppingBag,
  Users,
  ChevronDown,
  ChevronUp,
  LogOut,
  Images,
  Settings,
  BarChart4,
  Home,
  Layers,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubOpen, setIsSubOpen] = useState(false);

  const toggleSubmenu = () => setIsSubOpen(!isSubOpen);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (location.pathname.startsWith("/admin/categories")) {
      setIsSubOpen(true);
    }
  }, [location.pathname]);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) toggleSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem("Atoken");
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    window.location.href = "/admin/login";
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 
          bg-gradient-to-b from-[#144E8C] to-[#78CDD1] 
          text-white shadow-xl rounded-r-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col h-screen`}
      >
        <div className="p-6 bg-white/10 border-b border-white/20">
          <h1 className="text-2xl font-bold tracking-wide">FOSCAPE ADMIN</h1>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-xl transition-all ${
                  isActive("/admin/dashboard")
                    ? "bg-white text-[#144E8C] shadow-md"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="ml-3 font-medium">Dashboard</span>
              </Link>
            </li>

            <li>
              <button
                onClick={toggleSubmenu}
                className={`flex items-center justify-between w-full p-3 rounded-xl transition ${
                  location.pathname.startsWith("/admin/categories")
                    ? "bg-white text-[#144E8C] shadow-md"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <div className="flex items-center">
                  <LayoutGrid className="w-5 h-5" />
                  <span className="ml-3 font-medium">Categories</span>
                </div>
                {isSubOpen ? <ChevronUp /> : <ChevronDown />}
              </button>

              {isSubOpen && (
                <ul className="mt-2 ml-6 space-y-1">
                  <li>
                    <Link
                      to="/admin/categories/main"
                      onClick={handleLinkClick}
                      className={`block p-2 rounded-lg text-sm transition ${
                        isActive("/admin/categories/main")
                          ? "bg-white text-[#144E8C] shadow"
                          : "text-white/90 hover:bg-white/20"
                      }`}
                    >
                      Main Category
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/admin/categories/sub"
                      onClick={handleLinkClick}
                      className={`block p-2 rounded-lg text-sm transition ${
                        isActive("/admin/categories/sub")
                          ? "bg-white text-[#144E8C] shadow"
                          : "text-white/90 hover:bg-white/20"
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
                className={`flex items-center p-3 rounded-xl transition ${
                  isActive("/admin/products")
                    ? "bg-white text-[#144E8C] shadow-md"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="ml-3 font-medium">Products</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/orders"
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-xl transition ${
                  isActive("/admin/orders")
                    ? "bg-white text-[#144E8C] shadow-md"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="ml-3 font-medium">Orders</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/users"
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-xl transition ${
                  isActive("/admin/users")
                    ? "bg-white text-[#144E8C] shadow-md"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="ml-3 font-medium">Users</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/gallery"
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-xl transition ${
                  isActive("/admin/gallery")
                    ? "bg-white text-[#144E8C] shadow-md"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <Images className="w-5 h-5" />
                <span className="ml-3 font-medium">Gallery</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/sales"
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-xl transition ${
                  isActive("/admin/sales")
                    ? "bg-white text-[#144E8C] shadow-md"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <BarChart4 className="w-5 h-5" />
                <span className="ml-3 font-medium">Sales</span>
              </Link>
            </li>
            
            <li>
              <Link
                to="/admin/works"
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-xl transition ${
                  isActive("/admin/works")
                    ? "bg-white text-[#144E8C] shadow-md"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <Layers className="w-5 h-5" />
                <span className="ml-3 font-medium">Works</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/settings"
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-xl transition ${
                  isActive("/admin/settings")
                    ? "bg-white text-[#144E8C] shadow-md"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="ml-3 font-medium">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all shadow-md"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;