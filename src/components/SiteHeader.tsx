import React from "react";
import { Link } from "react-router";
// lucide-icons
import { AlignJustify, LogOut, User,
  
} from "lucide-react";
// auth context
import { useAuth } from "@/context/AuthContext";

interface SiteHeaderProps {
  className?: string;
  onToggleSidebar?: () => void;
  // showtoggle?: boolean;
  // isMobile?: boolean;
  // isSidebarOpen?: boolean;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({
  className = "",
  onToggleSidebar,
  // showtoggle = false,
  // isMobile = false,
  // isSidebarOpen = false,
}) => {

  const { logout, user } = useAuth();

  const role = user?.role;
  // console.log("role from SiteHeader - ", role)

  return (
    <header
      className={`bg-white shadow-xl border-b-4 border-gradient-to-r from-red-500 to-red-600 h-20 px-6 flex-shrink-0 z-50  ${className}`}
    >
      {/* Gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>

      <div className="flex items-center justify-between h-full w-full">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={onToggleSidebar}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-gray-600"
            >
              <AlignJustify className="w-6 h-6" />
            </button>
          </div>

          {/* Logo and Company Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={"Sunshine_logo_black.png"}
                alt="Company Logo"
                className="object-contain h-16 w-16 drop-shadow-sm"
              />
            </div>

            <Link to="/" className="hidden sm:flex flex-col group">
              <span className="text-xl lg:text-2xl font-bold text-gray-800 leading-tight group-hover:text-red-600 transition-colors duration-200">
                Sunshine Logistic Services
              </span>
              <span className="text-sm lg:text-base text-gray-600 font-medium">
                A Logistics Tracking Solution
              </span>
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-800">
                {user?.firstName + " " + user?.lastName}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {role}
              </span>
            </div>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout} // Use centralized logout
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium border border-red-200 hover:border-red-300 hover:shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Company Name */}
      <div className="sm:hidden fixed top-20 left-0 right-0 bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
        <div className="text-sm font-bold text-gray-800">Sunshine Logistics</div>
        <div className="text-xs text-gray-600 font-medium">{role === 'admin' ? 'Admin Panel' : 'Agent Panel' }</div>
      </div>
    </header>
  );
};

export default SiteHeader;
