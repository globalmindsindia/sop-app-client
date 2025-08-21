import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import companyLogo from "@/assets/gmi_logo.png";

export default function Footer() {
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
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <span className="text-sm font-medium">f</span>
              </div>
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <span className="text-sm font-medium">t</span>
              </div>
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <span className="text-sm font-medium">in</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2">
              {[
                "SOP Generation",
                "Resume Review",
                "University Matching",
                "Essay Writing",
                "Interview Prep",
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service}
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
              {[
                "Help Center",
                "FAQ",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
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
                  support@sopbuddy.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  123 Education St.
                  <br />
                  San Francisco, CA 94102
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 SOP Buddy. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Made with ❤️ for students worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
