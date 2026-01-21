import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuoteCart } from '@/contexts/QuoteCartContext';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  moq: number;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const { addItem } = useQuoteCart();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*').eq('is_active', true),
      supabase.from('categories').select('*'),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setIsLoading(false);
  }

  const handleAddToQuote = (product: Product) => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: '/placeholder.svg',
      moq: product.moq || 50,
    });
    toast.success(`${product.name} added to quote`);
  };

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-corporate">
          <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link to="/products">
              <Button variant={!selectedCategory ? 'default' : 'outline'} size="sm">
                All
              </Button>
            </Link>
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.id}`}>
                <Button variant={selectedCategory === cat.id ? 'default' : 'outline'} size="sm">
                  {cat.name}
                </Button>
              </Link>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No products available. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="card-corporate p-4">
                  <div className="aspect-square bg-muted rounded-md mb-4" />
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {product.description}
                  </p>
                  <p className="text-sm mt-2">MOQ: {product.moq || 50} units</p>
                  <Button
                    className="w-full mt-4"
                    onClick={() => handleAddToQuote(product)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Quote
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
