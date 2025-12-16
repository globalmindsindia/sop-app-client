import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import companyLogo from "@/assets/gmi_logo.png";

interface HeaderProps {
  onGetStarted: () => void;
}

export default function Header({ onGetStarted }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Features", path: "#features" },
    { name: "How It Works", path: "#how-it-works" },
    { name: "Accuracy", path: "#accuracy" },
    { name: "Testimonials", path: "#testimonials" },
  ];

  const scrollToSection = (sectionId: string) => {
    navigate("/");

    setTimeout(() => {
      const element = document.querySelector(sectionId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 120);

    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      {/* Animate INNER wrapper (safe) */}
      <motion.div
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <nav className="container-app">
          <div className="flex h-16 items-center justify-between relative">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-heading font-bold text-xl text-primary"
            >
              <img
                src={companyLogo}
                alt="Company Logo"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1 backdrop-blur-sm">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.path)}
                    className="relative px-4 py-2 font-body text-sm font-semibold text-foreground/80 hover:text-primary transition-all duration-300 rounded-full group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="relative z-10">{item.name}</span>

                    {/* Hover Background */}
                    <motion.div
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />

                    {/* Underline */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-3/4 transition-all duration-300"
                      style={{ transform: "translateX(-50%)" }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Get Started Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Button>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden py-4"
              >
                <div className="flex flex-col gap-2 bg-muted/30 rounded-lg p-4 backdrop-blur-sm">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      onClick={() => scrollToSection(item.path)}
                      className="relative font-body text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 text-left p-3 rounded-lg hover:bg-primary/10 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">{item.name}</span>

                      <motion.div
                        className="absolute left-0 top-1/2 w-1 h-0 bg-primary rounded-full group-hover:h-1/2 transition-all duration-300"
                        style={{ transform: "translateY(-50%)" }}
                      />
                    </motion.button>
                  ))}

                  <Button
                    onClick={() => {
                      onGetStarted();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold w-full mt-2 shadow-lg"
                  >
                    Get Started
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.div>
    </header>
  );
}
