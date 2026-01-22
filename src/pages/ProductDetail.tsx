import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuoteCart } from '@/contexts/QuoteCartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string | null;
  moq: number | null;
  size: string | null;
  material: string | null;
  capacity: string | null;
  colors: string[] | null;
}

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean | null;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const { addItem } = useQuoteCart();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    fetchProduct(id);
  }, [id]);

  async function fetchProduct(productId: string) {
    setIsLoading(true);
    const { data: productData } = await supabase.from('products').select('*').eq('id', productId).single();
    if (productData) {
      setProduct(productData as Product);
      if ((productData as Product).colors?.[0]) {
        setSelectedColor((productData as Product).colors[0]);
      }
    }

    const { data: imgs } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('is_primary', { ascending: false });
    if (imgs) {
      setImages(imgs as ProductImage[]);
    }

    setIsLoading(false);
  }

  const handleAddToQuote = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: images[0]?.image_url || '/placeholder.svg',
      moq: product.moq || 50,
      selectedColor: selectedColor,
    });
    toast.success('Added to quote');
  };

  const handleContactSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setIsSubmitting(true);
    try {
      await supabase.from('contacts').insert({
        user_id: user.id,
        product_id: product?.id,
        message: contactMessage,
        status: 'pending',
      });
      toast.success('Message sent to supplier!');
      setContactMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <Layout>
        <div className="section-padding container-corporate">Loading...</div>
      </Layout>
    );

  if (!product)
    return (
      <Layout>
        <div className="section-padding container-corporate">Product not found.</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="section-padding container-corporate">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images Section */}
          <div>
            {images.length > 0 ? (
              <div className="space-y-4">
                <img
                  src={images[0]?.image_url}
                  alt={product.name}
                  className="w-full rounded-lg object-cover"
                  style={{ maxHeight: '500px' }}
                />
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, i) => (
                      <img
                        key={img.id}
                        src={img.image_url}
                        alt={`${product.name}-${i}`}
                        className="h-20 w-20 object-cover rounded-md cursor-pointer hover:ring-2 ring-accent"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No images available</span>
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground mt-2 text-lg">{product.description}</p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3">Available Colors</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedColor === color
                          ? 'bg-accent text-accent-foreground ring-2 ring-offset-2 ring-accent'
                          : 'bg-muted hover:bg-muted-foreground/20 text-foreground'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="space-y-3 border-y py-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">MOQ (Minimum Order Qty)</p>
                  <p className="text-2xl font-bold text-accent">{product.moq || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Material</p>
                  <p className="text-lg font-semibold">{product.material || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="text-lg font-semibold">{product.size || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="text-lg font-semibold">{product.capacity || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button size="lg" onClick={handleAddToQuote} className="w-full">
                Add to Quote
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="w-full">
                    Contact Supplier
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Supplier</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleContactSupplier} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product</label>
                      <p className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded">
                        {product.name} {selectedColor ? `- ${selectedColor}` : ''}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea
                        placeholder="Tell the supplier what you're looking for..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        required
                        rows={5}
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Additional Info */}
            <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
              <p>For bulk orders or custom requirements, please contact the supplier directly.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
