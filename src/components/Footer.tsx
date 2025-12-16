import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import companyLogo from "@/assets/gmi_logo.png";
import indiaFlag from "@/assets/india-flag.png";
import germanyFlag from "@/assets/German-Flag.png";

export default function Footer() {
  const navigate = useNavigate();

  const handleFAQClick = () => {
    navigate("/");
    setTimeout(() => {
      const el = document.querySelector("#faq");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const services = [
    {
      name: "Foreign Language Training",
      url: "https://languages.globalmindsindia.in",
    },
    { name: "IELTS Training", url: "https://globalmindsindia.co.in" },
    { name: "APS Certificate", url: "https://aps.globalmindsindia.in" },
    { name: "Cost Calculator", url: "https://calculator.globalmindsindia.com" },
    { name: "Grade Calculator", url: "https://grade.globalmindsgermany.com" },
  ];

  const supportItems = [
    { label: "FAQ", onClick: handleFAQClick },
    { label: "Contact Us @ +91 7353446655", url: "tel:+917353446655" },
    { label: "Terms & Conditions", link: "/terms-and-conditions" },
    { label: "Privacy Policy", link: "/privacy-policy" },
    { label: "Refund Policy", link: "/refund-policy" },
  ];

  const socials = [
    {
      icon: <Facebook className="h-5 w-5" />,
      url: "https://www.facebook.com/people/Global-Minds-India/61573595922348/",
    },
    {
      icon: <Youtube className="h-5 w-5" />,
      url: "https://www.youtube.com/@GlobalMindsIndia-1",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      url: "https://www.instagram.com/globalminds_india/",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://www.linkedin.com/company/global-minds-india/",
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-primary text-primary-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* GRID */}
        <div className="grid md:grid-cols-4 gap-10">
          {/* LOGO + DESCRIPTION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={companyLogo} alt="GMI" className="h-16 w-auto" />
            </div>
            <p className="font-body text-sm text-primary-foreground/80 leading-relaxed">
              Empowering students worldwide to craft compelling statements of
              purpose that open doors to their dream universities and future
              careers.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              Services
            </h3>
            <ul className="space-y-2 font-body text-sm">
              {services.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 font-body text-sm">
              {supportItems.map((item) => (
                <li key={item.label}>
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="hover:text-accent transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : item.link ? (
                    <Link
                      to={item.link}
                      className="hover:text-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.url}
                      className="hover:text-accent transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:connect@globalmindsindia.com"
                  className="hover:text-accent transition-colors"
                >
                  connect@globalmindsindia.com
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a
                  href="tel:+917353446655"
                  className="hover:text-accent transition-colors"
                >
                  +91 7353446655
                </a>
              </li>

              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="flex items-center gap-2">
                  <img
                    src={indiaFlag}
                    className="h-4 w-6 rounded object-cover"
                  />
                  23, CJ VenkataDas road, Padmanabhanagar, Bangalore
                </span>
              </li>

              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="flex items-center gap-2">
                  <img
                    src={germanyFlag}
                    className="h-4 w-6 rounded object-cover"
                  />
                  Koenigsheideweg Berlin, Germany
                </span>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a
                  href="tel:+4917645728219"
                  className="hover:text-accent transition-colors"
                >
                  +49 17645728219
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-primary-foreground/20 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-sm text-primary-foreground/80">
              © {new Date().getFullYear()} Global Minds India. All rights
              reserved.
            </p>

            <div className="flex gap-4">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
