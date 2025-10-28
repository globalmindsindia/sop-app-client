import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import companyLogo from "@/assets/gmi_logo.png";

interface HeaderProps {
  onGetStarted: () => void;
}

export default function Header({ onGetStarted }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Accuracy", href: "#accuracy" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  const handleNavClick = (href: string) => {
    navigate("/");
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-300 shadow-md transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center h-16 justify-between">
          {/* Logo on extreme left */}
          <div className="flex-shrink-0">
            <Link to="/" aria-label="Home" className="inline-flex items-center">
              <img
                src={companyLogo}
                alt="Company Logo"
                className="h-14 w-auto object-contain" // Increased height to 56px (14 * 4)
              />
            </Link>
          </div>

          {/* Nav menu centered absolutely */}
          <nav className="hidden md:flex space-x-12 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="relative text-gray-700 text-base font-semibold hover:text-blue-600 transition-colors duration-300 px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {item.name}
                <span className="block absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 rounded group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* "Get Started" button on extreme right */}
          <div className="flex-shrink-0">
            <Button
              onClick={onGetStarted}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl text-white font-semibold px-6 py-2 transition duration-300"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button centered */}
          <div className="md:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              aria-label="Toggle menu"
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 animate-fade-in" />
              ) : (
                <Menu className="h-6 w-6 animate-fade-in" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden origin-top transform transition-all duration-300 ${
            isMobileMenuOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col space-y-3 mt-4 px-4 pb-6 bg-white rounded-lg shadow-lg border border-gray-200">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  handleNavClick(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className="text-base font-medium text-gray-700 hover:text-blue-600 text-left transition-colors duration-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {item.name}
              </button>
            ))}
            <Button
              onClick={() => {
                onGetStarted();
                setIsMobileMenuOpen(false);
              }}
              className="rounded-2xl mt-5 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition duration-300"
            >
              Get Started Free
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
