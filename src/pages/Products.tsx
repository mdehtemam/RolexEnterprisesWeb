import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/integrations/supabase/mockData';
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
    try {
      if (DEMO_MODE) {
        // Use mock data in demo mode
        setProducts(MOCK_PRODUCTS as any);
        setCategories(MOCK_CATEGORIES as any);
        setIsLoading(false);
        return;
      }

      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').eq('is_active', true),
        supabase.from('categories').select('*'),
      ]);

      if (productsRes.data && productsRes.data.length > 0) {
        setProducts(productsRes.data);
      } else {
        // Fallback to mock products
        console.log('No products found in database, using mock data');
        setProducts(MOCK_PRODUCTS as any);
      }

      if (categoriesRes.data && categoriesRes.data.length > 0) {
        setCategories(categoriesRes.data);
      } else {
        // Fallback to mock categories
        console.log('No categories found in database, using mock data');
        setCategories(MOCK_CATEGORIES as any);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data on error
      setProducts(MOCK_PRODUCTS as any);
      setCategories(MOCK_CATEGORIES as any);
      setIsLoading(false);
    }
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

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

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
          ) : filteredProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No products available. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="no-underline">
                  <div className="card-corporate p-4">
                    <div className="aspect-square bg-muted rounded-md mb-4" />
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <p className="text-sm mt-2">MOQ: {product.moq || 50} units</p>
                    <Button
                      className="w-full mt-4"
                      onClick={(e) => { e.preventDefault(); handleAddToQuote(product); }}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to Quote
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
