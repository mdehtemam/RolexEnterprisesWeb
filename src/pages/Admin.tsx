import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_PRODUCT_VARIANTS } from '@/integrations/supabase/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit2, Plus, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import { ManageCategories } from '@/components/admin/ManageCategories';
import { ManageProducts } from '@/components/admin/ManageProducts';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Quote = Database['public']['Tables']['quotes']['Row'];
type QuoteItem = Database['public']['Tables']['quote_items']['Row'];
type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
type ProductImage = Database['public']['Tables']['product_images']['Row'];

export default function Admin() {
  const { user, isLoading, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(DEMO_MODE ? (MOCK_PRODUCTS as any) : []);
  const [variants, setVariants] = useState<ProductVariant[]>(DEMO_MODE ? (MOCK_PRODUCT_VARIANTS as any) : []);
  const [categories, setCategories] = useState<Category[]>(DEMO_MODE ? (MOCK_CATEGORIES as any) : []);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [quotes, setQuotes] = useState<Array<Quote & { profile?: any; items?: QuoteItem[] }>>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchSku, setSearchSku] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    moq: 1,
    rate: 0,
    sku: '',
    colors: [] as string[],
    material: '',
    size: '',
    capacity: '',
  });
  const [colorVariants, setColorVariants] = useState<Array<{ color: string; sku: string; imageUrl?: string }>>([]);
  const [pendingVariantImages, setPendingVariantImages] = useState<Record<string, File[]>>({});
  const [newColor, setNewColor] = useState('');
  const [newColorSku, setNewColorSku] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  useEffect(() => {
    fetchData();
  }, []);

  // Filter products by SKU when search changes
  useEffect(() => {
    if (searchSku.trim()) {
      setFilteredProducts(
        products.filter(p => 
          p.sku?.toUpperCase().includes(searchSku.toUpperCase()) ||
          p.name.toUpperCase().includes(searchSku.toUpperCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchSku, products]);

  const fetchData = async () => {
    try {
      // Use mock data in demo mode
      if (DEMO_MODE) {
        console.log('🔧 [DEMO] Loaded mock data for admin panel');
        setProducts(MOCK_PRODUCTS as any);
        setVariants(MOCK_PRODUCT_VARIANTS as any);
        setCategories(MOCK_CATEGORIES as any);
        return;
      }

      const [productsRes, variantsRes, categoriesRes, imagesRes, quotesRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('product_variants').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('product_images').select('*'),
        supabase.from('quotes').select('*, profiles(name, phone)').order('created_at', { ascending: false }),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (variantsRes.data) setVariants(variantsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (imagesRes.data) setProductImages(imagesRes.data);

      if (categoriesRes.error) {
        console.error('Error fetching categories:', categoriesRes.error);
        toast.error('Failed to load categories');
      }
      if (productsRes.error) console.error('Error fetching products:', productsRes.error);
      if (variantsRes.error) console.error('Error fetching variants:', variantsRes.error);
      if (imagesRes.error) console.error('Error fetching images:', imagesRes.error);
      if (quotesRes.data) {
        const quotesWithItems = await Promise.all(
          quotesRes.data.map(async (quote: any) => {
            const itemsRes = await supabase
              .from('quote_items')
              .select('*')
              .eq('quote_id', quote.id);
            return {
              ...quote,
              items: itemsRes.data || [],
            };
          })
        );
        setQuotes(quotesWithItems);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (DEMO_MODE) {
        // Demo mode: add to local state
        const newProduct = {
          id: `product-${Date.now()}`,
          ...formData,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any;

        if (editingProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
          // Update variants in demo mode
          const updatedVariants = colorVariants.map(v => ({
            id: v.color + Date.now(), // Simple ID generation for demo
            product_id: editingProduct.id,
            color: v.color,
            sku: v.sku,
            image_url: v.imageUrl || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));
          setVariants(variants.filter(v => v.product_id !== editingProduct.id).concat(updatedVariants));
          toast.success('Product and variants updated in demo mode');
        } else {
          setProducts([...products, newProduct]);
          // Add variants in demo mode
          const newVariants = colorVariants.map((v, idx) => ({
            id: `variant-${Date.now()}-${idx}`,
            product_id: newProduct.id,
            color: v.color,
            sku: v.sku,
            image_url: v.imageUrl || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));
          setVariants([...variants, ...newVariants]);
          toast.success('Product and variants added in demo mode');
        }
      } else {
        // Real Supabase mode
        if (editingProduct) {
          await supabase
            .from('products')
            .update({
              ...formData,
              colors: formData.colors.length > 0 ? formData.colors : null,
            })
            .eq('id', editingProduct.id);
          
          // Delete old variants and add new ones
          await supabase.from('product_variants').delete().eq('product_id', editingProduct.id);
          
          if (colorVariants.length > 0) {
            const insertedVariantsRes = await supabase.from('product_variants').insert(
              colorVariants.map(v => ({
                product_id: editingProduct.id,
                color: v.color,
                sku: v.sku,
                image_url: v.imageUrl || null,
              }))
            ).select('*');

            const insertedVariants = insertedVariantsRes.data || [];
            // Upload any pending images per color (now we have fresh variant IDs)
            for (const v of insertedVariants) {
              const files = pendingVariantImages[v.color] || [];
              if (files.length > 0) {
                await uploadVariantImages(editingProduct.id, v.id, files);
              }
            }
          }
        } else {
          const productRes = await supabase.from('products').insert({
            ...formData,
            colors: formData.colors.length > 0 ? formData.colors : null,
            is_active: true,
          }).select('*');

          if (productRes.data?.[0]) {
            const productId = productRes.data[0].id;
            if (colorVariants.length > 0) {
              const insertedVariantsRes = await supabase.from('product_variants').insert(
                colorVariants.map(v => ({
                  product_id: productId,
                  color: v.color,
                  sku: v.sku,
                  image_url: v.imageUrl || null,
                }))
              ).select('*');

              const insertedVariants = insertedVariantsRes.data || [];
              for (const v of insertedVariants) {
                const files = pendingVariantImages[v.color] || [];
                if (files.length > 0) {
                  await uploadVariantImages(productId, v.id, files);
                }
              }
            }
          }
        }
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category_id: '',
        moq: 1,
        rate: 0,
        sku: '',
        colors: [],
        material: '',
        size: '',
        capacity: '',
      });
      setColorVariants([]);
      setPendingVariantImages({});
      if (!DEMO_MODE) fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure?')) {
      if (DEMO_MODE) {
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted in demo mode');
      } else {
        await supabase.from('products').delete().eq('id', id);
        fetchData();
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    const productVariants = variants.filter(v => v.product_id === product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      category_id: product.category_id || '',
      moq: product.moq || 1,
      rate: (product as any).rate || 0,
      sku: product.sku || '',
      colors: (product.colors || []) as string[],
      material: product.material || '',
      size: product.size || '',
      capacity: product.capacity || '',
    });
    setColorVariants(productVariants.map(v => ({
      color: v.color,
      sku: v.sku,
      imageUrl: v.image_url || undefined,
    })));
    setPendingVariantImages({});
    setIsDialogOpen(true);
  };

  const addColor = () => {
    if (newColor && newColorSku && !colorVariants.some(v => v.color === newColor)) {
      setColorVariants([
        ...colorVariants,
        { color: newColor, sku: newColorSku },
      ]);
      setNewColor('');
      setNewColorSku('');
    }
  };

  const removeColor = (color: string) => {
    setColorVariants(colorVariants.filter(v => v.color !== color));
  };

  const uploadVariantImages = async (productId: string, variantId: string, files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      if (DEMO_MODE) {
        toast.info('📁 In demo mode, image uploads are simulated');
        return;
      }

      // Determine if this variant already has a primary image
      const existingVariantImages = productImages.filter((img) => img.variant_id === variantId);
      const hasPrimary = existingVariantImages.some((img) => img.is_primary);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const safeName = file.name.replace(/[^\w.\-]+/g, '_');
        const path = `${productId}/${variantId}/${Date.now()}-${i}-${safeName}`;

        const uploadRes = await supabase.storage.from('product-images').upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (uploadRes.error) throw uploadRes.error;

        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        await supabase.from('product_images').insert({
          product_id: productId,
          variant_id: variantId,
          image_url: data.publicUrl,
          is_primary: !hasPrimary && i === 0,
        });
      }

      await fetchData();
    } catch (error) {
      console.error('Error uploading variant images:', error);
      toast.error('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const setPrimaryVariantImage = async (variantId: string, imageId: string) => {
    if (DEMO_MODE) return;
    try {
      await supabase.from('product_images').update({ is_primary: false }).eq('variant_id', variantId);
      await supabase.from('product_images').update({ is_primary: true }).eq('id', imageId);
      await fetchData();
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast.error('Failed to set primary image');
    }
  };

  const deleteVariantImage = async (image: ProductImage) => {
    if (DEMO_MODE) return;
    try {
      // Best effort delete from storage if it belongs to our bucket URL format
      // Public URL contains "/storage/v1/object/public/product-images/<path>"
      const marker = '/storage/v1/object/public/product-images/';
      const idx = image.image_url.indexOf(marker);
      if (idx !== -1) {
        const objectPath = image.image_url.substring(idx + marker.length);
        await supabase.storage.from('product-images').remove([objectPath]);
      }
      await supabase.from('product_images').delete().eq('id', image.id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const createCategory = async () => {
    const name = newCategory.name.trim();
    if (!name) return;
    try {
      if (DEMO_MODE) {
        const cat = { id: `cat-${Date.now()}`, name, description: newCategory.description, icon: null, created_at: new Date().toISOString() } as any;
        setCategories((prev) => [cat, ...prev]);
        setIsCategoryDialogOpen(false);
        setNewCategory({ name: '', description: '' });
        toast.success('Category added (demo mode)');
        return;
      }
      const res = await supabase.from('categories').insert({ name, description: newCategory.description || null }).select('*').single();
      if (res.error) throw res.error;
      setCategories((prev) => [res.data as any, ...prev]);
      setIsCategoryDialogOpen(false);
      setNewCategory({ name: '', description: '' });
      toast.success('Category added');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to add category');
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category_id: '',
      moq: 1,
      rate: 0,
      sku: '',
      colors: [],
      material: '',
      size: '',
      capacity: '',
    });
    setColorVariants([]);
    setNewColor('');
    setNewColorSku('');
  };

  return (
    <Layout>
      <div className="section-padding container-corporate">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6 mt-6">
            <ManageProducts products={products} categories={categories} onUpdate={fetchData} />
          </TabsContent>

          {/* Quotations Tab */}
          <TabsContent value="quotations" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Customer Quotations</h2>
            <div className="space-y-4">
              {quotes.map((quote: any) => (
                <Card key={quote.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Quote #{quote.id.slice(0, 8)}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          User: {quote.profile?.name || 'Unknown'} ({quote.profile?.phone || 'N/A'})
                        </p>
                      </div>
                      <span className="text-sm font-medium px-3 py-1 rounded bg-accent text-accent-foreground">
                        {quote.status || 'pending'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Items Requested:</h4>
                      <div className="space-y-2">
                        {quote.items?.map((item: QuoteItem) => (
                          <div key={item.id} className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} | Notes: {item.customization_notes || 'N/A'}
                          </div>
                        ))}
                      </div>
                    </div>
                    {quote.notes && (
                      <div>
                        <h4 className="font-medium mb-1">Notes:</h4>
                        <p className="text-sm text-muted-foreground">{quote.notes}</p>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Requested: {new Date(quote.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6 mt-6">
            <ManageCategories categories={categories} products={products} onUpdate={fetchData} />
          </TabsContent>
        </Tabs>

        {/* Add Category Dialog */}
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="e.g., Backpacks" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} placeholder="Optional description" />
              </div>
              <div className="flex gap-2">
                <Button onClick={createCategory} className="flex-1">Create</Button>
                <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
