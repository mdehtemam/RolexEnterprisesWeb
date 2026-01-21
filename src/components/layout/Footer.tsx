import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="gradient-navy text-primary-foreground">
      <div className="container-corporate section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent">
                <span className="text-lg font-bold text-accent-foreground">R</span>
              </div>
              <span className="text-lg font-semibold">Rolex Enterprises</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Premium corporate, promotional & wholesale bags for businesses. Trusted by leading companies nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Products
              </Link>
              <Link to="/about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Categories</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/products?category=laptop-bags" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Laptop Bags
              </Link>
              <Link to="/products?category=backpacks" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Backpacks
              </Link>
              <Link to="/products?category=messenger-bags" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Messenger Bags
              </Link>
              <Link to="/products?category=travel-bags" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Travel Bags
              </Link>
              <Link to="/products?category=promotional" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Promotional Bags
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                <span>info@rolexenterprises.com</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>123 Business District,<br />Mumbai, India 400001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/70">
              © {new Date().getFullYear()} Rolex Enterprises. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
