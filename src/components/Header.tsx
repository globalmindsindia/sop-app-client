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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex-shrink-0">
              <img
                src={companyLogo}
                alt="Company Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: CTA + Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={onGetStarted}
              className="hidden md:inline-flex rounded-xl shadow-soft hover:shadow-hover transition"
            >
              Get Started
            </Button>
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-3 px-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition text-left"
                >
                  {item.name}
                </button>
              ))}
              <Button
                onClick={() => {
                  onGetStarted();
                  setIsMobileMenuOpen(false);
                }}
                className="rounded-xl mt-4 w-full"
                size="sm"
              >
                Get Started Free
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
