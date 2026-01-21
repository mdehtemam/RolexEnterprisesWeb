export function TrustedClientsSection() {
  // Placeholder client logos - in production, these would be actual client logos
  const clients = [
    'TechCorp India',
    'Global Systems',
    'InnovateTech',
    'Enterprise Solutions',
    'Digital Dynamics',
    'Smart Industries',
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container-corporate">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Trusted by Leading Companies
          </h2>
          <p className="mt-4 text-muted-foreground">
            We're proud to serve some of the most respected organizations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-16 px-4 bg-background rounded-lg border"
            >
              <span className="text-sm font-medium text-muted-foreground text-center">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
