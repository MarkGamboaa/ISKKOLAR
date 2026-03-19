import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, getRoleDashboard } = useAuth();
  const navigate = useNavigate();

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Home", action: () => scrollTo("hero") },
    { label: "About", action: () => scrollTo("about") },
    { label: "Programs", action: () => scrollTo("programs") },
    { label: "Contact", action: () => scrollTo("contact") },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div>
              <span className="text-lg font-bold text-primary tracking-tight">
              IS<span className="text-yellow-400">KK</span>OLAR
              </span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-1.5">by KKFI</span>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-primary/5 transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <a
                  href={getRoleDashboard(user?.role)}
                  className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Dashboard
                </a>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-light rounded-lg transition-colors shadow-sm hover:shadow-md"
                >
                  Apply Now
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                {link.label}
              </button>
            ))}
            <hr className="my-2 border-gray-100" />
            {isAuthenticated ? (
              <>
                <a
                  href={getRoleDashboard(user?.role)}
                  className="block px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Dashboard
                </a>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }}
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-light rounded-lg"
                >
                  Apply Now
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
