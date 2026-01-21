import { Link } from 'react-router-dom';
import { Laptop, Backpack, Mail, Plane, Gift } from 'lucide-react';
import laptopBag from '@/assets/laptop-bag.jpg';
import backpack from '@/assets/backpack.jpg';
import slingBag from '@/assets/sling-bag.jpg';
import trolleyBag from '@/assets/trolley-bag.jpg';
import promotionalBag from '@/assets/promotional-bag.jpg';

const categories = [
  {
    name: 'Laptop Bags',
    slug: 'laptop-bags',
    description: 'Professional bags for laptops and business essentials',
    icon: Laptop,
    image: laptopBag,
  },
  {
    name: 'Backpacks',
    slug: 'backpacks',
    description: 'Ergonomic backpacks for daily corporate use',
    icon: Backpack,
    image: backpack,
  },
  {
    name: 'Sling / Messenger Bags',
    slug: 'messenger-bags',
    description: 'Stylish messenger bags for the modern professional',
    icon: Mail,
    image: slingBag,
  },
  {
    name: 'Travel / Trolley Bags',
    slug: 'travel-bags',
    description: 'Premium travel solutions for corporate travelers',
    icon: Plane,
    image: trolleyBag,
  },
  {
    name: 'Custom / Promotional Bags',
    slug: 'promotional',
    description: 'Branded bags for events and promotions',
    icon: Gift,
    image: promotionalBag,
  },
];

export function CategoriesSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-corporate">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Our Product Categories
          </h2>
          <p className="mt-4 text-muted-foreground">
            Explore our wide range of corporate and promotional bags, designed for businesses of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className="group card-corporate overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
