import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuRef = useRef(null);

  // Logout
  const handleLogout = () => {
    logout();
    setShowMenu(false);
    setShowMobileMenu(false);
    navigate("/login");
  };

  // Desktop navigation style
  const navStyle = ({ isActive }) =>
    `relative py-2 text-sm font-semibold tracking-wide transition-colors duration-200
    after:absolute after:bottom-0 after:left-0 after:h-0.5
    after:bg-indigo-600 after:rounded-full after:transition-all
    after:duration-300
    ${
      isActive
        ? "text-slate-950 after:w-full"
        : "text-slate-600 hover:text-slate-950 after:w-0 hover:after:w-full"
    }`;

  // Mobile navigation style
  const mobileNavStyle = ({ isActive }) =>
    `block px-4 py-3 rounded-xl text-sm font-semibold transition
    ${
      isActive
        ? "bg-slate-100 text-slate-950"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
    }`;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  return (
    <>
      {/* =========================================================
          FIXED HEADER
          ========================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">

        {/* =======================================================
            MAIN NAVBAR
            ======================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-[72px] flex items-center justify-between">

          {/* =====================================================
              LOGO
              ===================================================== */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
          >
            {/* Logo Box */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white font-bold text-lg shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rounded-lg">
              Y
            </div>

            {/* Brand Name */}
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                YASSH
              </h1>

              <p className="text-[8px] sm:text-[9px] tracking-[3px] sm:tracking-[4px] text-slate-400 font-bold mt-0.5 uppercase">
                Enterprises
              </p>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
              ===================================================== */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">

            {/* Home */}
            <NavLink to="/" className={navStyle}>
              Home
            </NavLink>

            {/* Products */}
            <NavLink to="/products" className={navStyle}>
              Products
            </NavLink>

            {/* My Orders */}
            {userInfo && (
              <NavLink to="/myorders" className={navStyle}>
                My Orders
              </NavLink>
            )}

            {/* Contact */}
            <NavLink to="/contact" className={navStyle}>
              Contact
            </NavLink>

            {/* =================================================
                LOGIN / PROFILE
                ================================================= */}
            {!userInfo ? (
              /* LOGIN */
              <Link
                to="/login"
                className="bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                Login
              </Link>
            ) : (
              /* PROFILE DROPDOWN */
              <div className="relative" ref={menuRef}>

                {/* Profile Button */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition"
                >

                  {/* Profile Initial */}
                  <div className="w-8 h-8 rounded-full bg-slate-950 text-white font-bold text-sm flex items-center justify-center">
                    {userInfo.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  {/* Name and Role */}
                  <div className="hidden lg:block text-left">
                    <p className="font-bold text-xs text-slate-800 max-w-[100px] truncate">
                      {userInfo.name || "User"}
                    </p>

                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      {userInfo.isAdmin ? "Admin" : "Customer"}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span
                    className={`text-slate-400 transition-transform duration-300 ${
                      showMenu ? "rotate-180" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {/* =================================================
                    PROFILE DROPDOWN
                    ================================================= */}
                {showMenu && (
                  <div className="absolute right-0 mt-3 w-72 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">

                    {/* User Information */}
                    <div className="bg-slate-950 text-white p-5">
                      <p className="font-bold truncate">
                        {userInfo.name}
                      </p>

                      <p className="text-xs text-slate-400 truncate mt-1">
                        {userInfo.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">

                      {/* My Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setShowMenu(false)}
                        className="block px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
                      >
                        My Profile
                      </Link>

                      {/* My Orders */}
                      <Link
                        to="/myorders"
                        onClick={() => setShowMenu(false)}
                        className="block px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
                      >
                        My Orders
                      </Link>

                      {/* Admin Panel */}
                      {userInfo.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowMenu(false)}
                          className="block px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* =====================================================
              MOBILE MENU BUTTON
              ===================================================== */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">

              {/* Top line */}
              <span
                className={`block w-5 h-0.5 bg-slate-800 transition ${
                  showMobileMenu
                    ? "rotate-45 translate-y-2"
                    : ""
                }`}
              />

              {/* Middle line */}
              <span
                className={`block w-5 h-0.5 bg-slate-800 transition ${
                  showMobileMenu
                    ? "opacity-0"
                    : ""
                }`}
              />

              {/* Bottom line */}
              <span
                className={`block w-5 h-0.5 bg-slate-800 transition ${
                  showMobileMenu
                    ? "-rotate-45 -translate-y-1"
                    : ""
                }`}
              />

            </div>
          </button>
        </div>

        {/* =======================================================
            MOBILE NAVIGATION
            ======================================================= */}
        <div
          className={`md:hidden overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 ${
            showMobileMenu
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav className="px-4 sm:px-6 py-4 space-y-1">

            {/* Home */}
            <NavLink
              to="/"
              className={mobileNavStyle}
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </NavLink>

            {/* Products */}
            <NavLink
              to="/products"
              className={mobileNavStyle}
              onClick={() => setShowMobileMenu(false)}
            >
              Products
            </NavLink>

            {/* My Orders */}
            {userInfo && (
              <NavLink
                to="/myorders"
                className={mobileNavStyle}
                onClick={() => setShowMobileMenu(false)}
              >
                My Orders
              </NavLink>
            )}

            {/* Contact */}
            <NavLink
              to="/contact"
              className={mobileNavStyle}
              onClick={() => setShowMobileMenu(false)}
            >
              Contact
            </NavLink>

            {/* =================================================
                MOBILE LOGIN / PROFILE
                ================================================= */}
            {!userInfo ? (
              /* LOGIN */
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="block text-center bg-slate-950 text-white px-4 py-3 rounded-xl text-sm font-semibold mt-2"
              >
                Login
              </Link>
            ) : (
              <>
                {/* Mobile User Information */}
                <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">

                  <div className="flex items-center gap-3">

                    {/* Profile Initial */}
                    <div className="w-10 h-10 rounded-full bg-slate-950 text-white font-bold flex items-center justify-center">
                      {userInfo.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    {/* User Details */}
                    <div>
                      <p className="font-bold text-sm text-slate-900">
                        {userInfo.name || "User"}
                      </p>

                      <p className="text-xs text-slate-400">
                        {userInfo.email}
                      </p>

                      <p className="text-[10px] font-semibold text-slate-400 uppercase mt-1">
                        {userInfo.isAdmin
                          ? "Administrator"
                          : "Customer"}
                      </p>
                    </div>

                  </div>
                </div>

                {/* My Profile */}
                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                >
                  My Profile
                </Link>

                {/* Admin Dashboard */}
                {userInfo.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* Sign Out */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* =========================================================
          HEADER SPACING
          
          This prevents the fixed navbar from covering page content.
          ========================================================= */}
      <div className="h-16 sm:h-[72px]" />
    </>
  );
}

export default Header;