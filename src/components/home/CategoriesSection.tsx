import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Backpack, Mail, Plane, Gift } from 'lucide-react';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { MOCK_CATEGORIES } from '@/integrations/supabase/mockData';
import laptopBag from '@/assets/laptop-bag.jpg';
import backpack from '@/assets/backpack.jpg';
import slingBag from '@/assets/sling-bag.jpg';
import trolleyBag from '@/assets/trolley-bag.jpg';
import promotionalBag from '@/assets/promotional-bag.jpg';

interface Category {
  id: string;
  name: string;
  description?: string;
}

const categoryImages: Record<string, string> = {
  'Laptop Bags': laptopBag,
  'Backpack': backpack,
  'Backpacks': backpack,
  'Men Sling Bag': slingBag,
  'Sling Bags': slingBag,
  'Travel Bag': trolleyBag,
  'Travel / Trolley Bags': trolleyBag,
  'Trolley Bags': trolleyBag,
  'Promotional Bags': promotionalBag,
  'Custom / Promotional Bags': promotionalBag,
  'Shoulder Bags': slingBag,
  'Tote Bags': promotionalBag,
};

const categoryIcons: Record<string, any> = {
  'Laptop Bags': Laptop,
  'Backpack': Backpack,
  'Backpacks': Backpack,
  'Men Sling Bag': Mail,
  'Sling Bags': Mail,
  'Travel Bag': Plane,
  'Travel / Trolley Bags': Plane,
  'Trolley Bags': Plane,
  'Promotional Bags': Gift,
  'Custom / Promotional Bags': Gift,
  'Shoulder Bags': Mail,
  'Tote Bags': Gift,
};

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      if (DEMO_MODE) {
        // Use mock data in demo mode
        setCategories(MOCK_CATEGORIES as any);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.from('categories').select('id, name, description');
      
      if (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock data if database fails
        setCategories(MOCK_CATEGORIES as any);
      } else if (!data || data.length === 0) {
        // Fallback to mock data if no categories in database
        console.log('No categories found in database, using mock data');
        setCategories(MOCK_CATEGORIES as any);
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to mock data on error
      setCategories(MOCK_CATEGORIES as any);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-corporate text-center">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </section>
    );
  }
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

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name] || Backpack;
              const imageUrl = categoryImages[category.name] || laptopBag;

              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group card-corporate overflow-hidden"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-md bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {category.description || 'Browse our collection'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
