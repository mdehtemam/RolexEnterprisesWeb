import { Link } from 'react-router-dom';
import { ArrowRight, Package, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative container-corporate py-20 md:py-32">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            Corporate & Promotional Bags for Businesses
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/80">
            Bulk orders • Custom branding • Wholesale pricing
          </p>
          <p className="mt-4 text-base text-primary-foreground/70">
            Trusted by leading corporations, institutions, and event organizers. 
            Premium quality bags with your logo and branding.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                Request a Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/products">
                View Product Catalog
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/20">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-primary-foreground">5000+</p>
                <p className="text-sm text-primary-foreground/70">Products</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-primary-foreground">200+</p>
                <p className="text-sm text-primary-foreground/70">Corporate Clients</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-primary-foreground">15+</p>
                <p className="text-sm text-primary-foreground/70">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
