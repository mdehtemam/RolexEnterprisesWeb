import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="section-padding gradient-navy">
      <div className="container-corporate text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
          Ready to Order Corporate Bags?
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
          Get in touch with our team for personalized quotes, bulk pricing, and customization options.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">
              Request a Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            <Phone className="mr-2 h-4 w-4" />
            Call Us Now
          </Button>
        </div>
      </div>
    </section>
  );
}
