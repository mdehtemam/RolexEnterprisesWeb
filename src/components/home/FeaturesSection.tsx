import { Package, Paintbrush, Truck, Shield } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Bulk Orders',
    description: 'Minimum order quantities starting from just 50 units with competitive wholesale pricing.',
  },
  {
    icon: Paintbrush,
    title: 'Custom Branding',
    description: 'Logo printing, embroidery, and full customization options to match your brand identity.',
  },
  {
    icon: Truck,
    title: 'Pan-India Delivery',
    description: 'Fast and reliable shipping across India with dedicated logistics support.',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Premium materials and strict quality control for long-lasting products.',
  },
];

export function FeaturesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-corporate">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why Choose Rolex Enterprises?
          </h2>
          <p className="mt-4 text-muted-foreground">
            We deliver premium quality corporate bags with exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                <feature.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
