import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Calendar, MapPin, ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import InfoBar from "./commons/InfoBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import axiosInstance from "../services/axiosInstance";
// import { formatDateRange } from "./commons/formatDateRange";
import { useAuth } from "@/context/AuthContext"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ✅ Types
interface NavLink {
  name: string;
  path: string;
  isSection?: boolean;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [user, setUser] = useState<{ firstName?: string; avatarUrl?: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // use AuthContext
  console.log(user)


  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Handle smooth scrolling for section links when on home page
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // Only proceed if we're on the home page
    if (location.pathname === "/") {
      e.preventDefault();
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        // Update URL without reloading
        window.history.pushState(null, "", path);
      }
    }
  };

  // Handle hash change (for browser back/forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      if (location.pathname === "/" && location.hash) {
        const element = document.querySelector(location.hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [location.pathname, location.hash]);

  const navLinks: NavLink[] = [
    { name: "Home", path: "/", isSection: false },
    { name: "Services", path: "/services", isSection: false },
    { name: "About", path: "/about", isSection: false },
    { name: "Contact", path: "/contact", isSection: false },
  ];

  

  // Check if link is active
  const isActive = (path: string, isSection?: boolean) => {
    if (isSection) {
      // For section links, check if we're on home page and the hash matches
      return location.pathname === "/" && location.hash === path;
    } else if (path === "/") {
      // For home link, it's active only if we're at root with no hash
      return location.pathname === "/" && !location.hash;
    } else {
      // For regular routes
      return location.pathname.startsWith(path);
    }
  };

  // const navigate = useNavigate();

  const handleRegisterClick = () => {
    setIsMobileMenuOpen(false); // Close the drawer
    navigate("/agent-registration"); // Navigate to registration
  };

  return (
    <>
      <InfoBar />
      {/* Main Navbar */}

      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "top-0 bg-white/20 backdrop-blur-md glass border-b border-neon-pink/20 shadow-lg shadow-gray-400/25 py-2"
          : "bg-transparent backdrop-blur-md py-3 md:mt-0"
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/"
                
                className="relative flex items-center"
              >
                <img
                  src="/Sunshine_logo_black.png"
                  // src="SunshineLogisticsLogoBlack.png"
                  alt="Courier Tracking"
                  className={`transition-all duration-300 ${isScrolled ? "h-9 w-auto" : "h-11 w-auto"
                    } object-contain`}
                />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  {link.isSection ? (
                    <a
                      href={link.path}
                      className={` text-base transition-all duration-300 font-medium ${isActive(link.path, link.isSection)
                        ? "text-green-400"
                        : "text-black hover:text-[#D32F2F]"
                        }`}
                      onClick={(e) => {
                        // Only apply special handling when on home page
                        if (location.pathname === "/") {
                          handleSectionClick(e, link.path);
                        }
                      }}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`text-base transition-all duration-300 font-medium ${isActive(link.path, link.isSection)
                        ? "text-black"
                        : "text-black hover:text-primary"
                        }`}
                    >
                      {link.name}
                    </Link>
                  )}
                  {isActive(link.path, link.isSection) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              ))}
            </nav>

            {/* Register button */}
            {/* Login & Register buttons */}
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  {/* Login button  if you want to enable these button then you have to remove this class :pointer-events-none */}
                  <Button className=" text-black bg-transparent font-medium border border-black px-6 py-3 rounded-md transition-all duration-300 hover:bg-transparent hover:text-black hover:shadow-[-4px_4px_0px_black] hover:translate-x-1 hover:-translate-y-1 pointer-events-none" > <Link to="/login" className="flex items-center"> Login </Link> </Button>

                  {/* Register button */}
                  <Button className=" text-white bg-primary font-medium px-6 py-3 rounded-md transition-all duration-300 hover:bg-primary/90 hover:text-white hover:shadow-[-4px_4px_0px_black] hover:translate-x-1 hover:-translate-y-1 pointer-events-none " > <Link to="/customer-registration" className="flex items-center"> Register </Link> </Button>
                </>
              ) : (
                // Avatar with Dropdown when logged in
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>

                    {/* This snippets is testing for how avatar url is generated & this 
                    code unable to display avatar fallback if src is broken and something wrong with 
                    image due to Avatar image is wrapped in a fragment thats why avatar fallback 
                    never triggered */}
                    {/* <Avatar className="w-10 h-10 cursor-pointer">
                      {user?.avatar ? (
                        <>
                          {console.log(
                            "Avatar URL:",
                            `${import.meta.env.VITE_API_BASE_URL}${user?.avatar}`,
                            "Avatar name:", `${user?.firstName?.[0] || "U"}`
                          )
                        
                          }
                          <AvatarImage
                            // src={`${import.meta.env.VITE_API_BASE_URL}/uploads/agent-avatars/1760483992911-348788370.jpg`}
                            // src="https://github.com/shadcn.png"
                            src={`${import.meta.env.VITE_API_BASE_URL}${user?.avatar}`}
                            alt={user?.firstName}
                          />
                        </>
                      ) : (
                        <AvatarFallback>
                          {user?.firstName?.[0] || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar> */}

                    <Avatar className="w-10 h-10 cursor-pointer">
                      <AvatarImage
                        src={`${import.meta.env.VITE_API_BASE_URL}${user?.avatar}`}
                        alt={user?.firstName}
                      />
                      <AvatarFallback>
                        {user?.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>

                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {/* <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={logout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>


            {/* Mobile menu button */}
            <button
              className="lg:hidden text-[#004A89] hover:text-[#D32F2F] transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header >

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {
          isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute z-50 right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="mt-6 space-y-0">
                  {navLinks.map((link) => (
                    <div key={link.name} className="py-3">
                      {link.isSection ? (
                        <a
                          href={link.path}
                          className={`block font-medium text-lg transition-colors duration-300 border-b border-gray-100 pb-3 ${isActive(link.path, link.isSection)
                            ? "text-[#D32F2F] border-[#D32F2F]/30"
                            : "text-[#004A89] hover:text-[#D32F2F]"
                            }`}
                          onClick={(e) => {
                            setIsMobileMenuOpen(true);
                            // Only apply special handling when on home page 
                            if (location.pathname === "/") {
                              e.preventDefault();
                              setTimeout(() => {
                                handleSectionClick(e, link.path);
                              }, 300); // Delay to allow menu to close
                            }
                          }}
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className={`block font-medium text-lg transition-colors duration-300 border-b border-gray-100 pb-3 ${isActive(link.path, link.isSection)
                            ? "text-[#D32F2F] border-[#D32F2F]/30"
                            : "text-[#004A89] hover:text-[#D32F2F]"
                            }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile register button */}
                <div className="mt-8 space-y-3">
                  <Button
                    onClick={handleRegisterClick}
                    className="w-full bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    Register Now
                    <ArrowRight size={16} className="ml-2 text-white" />
                  </Button>
                </div>

                {/* Event info */}
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="font-medium text-[#004A89] mb-3">
                    Event Details
                  </h3>
                  <div className="flex items-start mb-3">
                    <Calendar size={18} className="text-[#D32F2F] mr-3 mt-0.5" />
                    <div>
                      <p className="text-base font-medium text-[#004A89]">
                        {/* {formatDateRange(
                        eventData.startDateTime,
                        eventData.endDateTime
                      )} */}
                      </p>
                      {/* <p className="text-sm text-gray-600">9:00 AM - 5:30 PM</p> */}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin size={18} className="text-[#D32F2F] mr-3 mt-0.5" />
                    <div>
                      <p className="text-base font-medium text-[#004A89]">
                        {"eventData.venue"}
                      </p>
                      {/* <p className="text-sm text-gray-600">New Delhi, India</p> */}
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="mt-6 flex justify-center space-x-4">
                  <a
                    href="#"
                    className="text-[#004A89] hover:text-[#D32F2F] transition-colors p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-[#004A89] hover:text-[#D32F2F] transition-colors p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-[#004A89] hover:text-[#D32F2F] transition-colors p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-[#004A89] hover:text-[#D32F2F] transition-colors p-2 rounded-full hover:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >

      <div
        className={`${isScrolled ? "h-16" : "h-15"
          } transition-all duration-300`}
      ></div>
    </>
  );
};

export default Navbar;
