import { Mail, MapPin, Phone, Facebook, Linkedin, Instagram, Youtube } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import companyLogo from "@/assets/gmi_logo.png";

export default function Footer() {
  const navigate = useNavigate();

  const supportItems = [
    "FAQ",
    "Contact Us @ +91 7353446655",
    "Terms and Conditions",
    "Privacy Policy",
    "Refund Policy",
  ];

  const handleFAQClick = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.querySelector("#faq");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // External Services Links
  const services = [
    { name: "Foreign Language Training", url: "https://languages.globalmindsindia.in" },
    { name: "IELTS Training", url: "https://globalmindsindia.in" },
    { name: "APS Certificate", url: "https://aps.globalmindsindia.in" },
    { name: "Cost Calculator", url: "https://calculator.globalmindsindia.com" },
    { name: "Grade Calculator", url: "https://grade.globalmindsgermany.com" },
  ];

  // Social Media Links
  const socialLinks = [
    {
      name: "YouTube",
      icon: <Youtube className="h-5 w-5" />,
      url: "https://www.youtube.com/@GlobalMindsIndia-1",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      url: "https://www.facebook.com/people/Global-Minds-India/61573595922348/",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://www.linkedin.com/company/global-minds-india/",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "https://www.instagram.com/globalminds_india/",
    },
  ];

  return (
    <footer className="bg-gradient-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={companyLogo}
                alt="Company Logo"
                className="h-10 w-auto object-contain mb-4"
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering students worldwide to craft compelling statements of
              purpose that open doors to their dream universities and future
              careers.
            </p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map(({ name, icon, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer"
                  aria-label={name}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2">
              {supportItems.map((item) => (
                <li key={item}>
                  {item === "Terms and Conditions" ? (
                    <Link
                      to="/terms-and-conditions"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  ) : item === "Refund Policy" ? (
                    <Link
                      to="/refund-policy"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  ) : item === "Privacy Policy" ? (
                    <Link
                      to="/privacy-policy"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  ) : item === "FAQ" ? (
                    <button
                      onClick={handleFAQClick}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </button>
                  ) : item === "Contact Us @ +91 7353446655" ? (
                    <a
                      href="tel:+917353446655"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  ) : (
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  <a href="mailto:connect@globalmindsindia.com" className="hover:underline">
                    connect@globalmindsindia.com
                  </a>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">+91 7353446655</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <div className="text-sm text-muted-foreground">
                  23, CJ VenkataDas road,
                  <br />
                  Padmanabhanagar, Bangalore
                  <br />
                  <a href="tel:+917353446655" className="hover:underline text-primary">
                    +91 7353446655
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <div className="text-sm text-muted-foreground">
                  Overseas Office - Germany
                  <br />
                  Koenigsheideweg Berlin, Germany
                  <br />
                  <a href="tel:+4917645728219" className="hover:underline text-primary">
                    +49 17645728219
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Global Minds India. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Made with ❤️ for students worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
