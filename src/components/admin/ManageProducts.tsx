import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  sku: string;
  category_id: string;
  moq?: number;
  rate?: number;
  description?: string;
  image_url?: string;
}

interface Category {
  id: string;
  name: string;
}

interface ColorVariant {
  color: string;
  sku: string;
  images: File[];
  previewUrls: string[];
}

interface ManageProductsProps {
  products: Product[];
  categories: Category[];
  onUpdate: () => void;
}

export function ManageProducts({ products, categories, onUpdate }: ManageProductsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category_id: '',
    moq: 1,
    rate: 0,
    description: '',
  });
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [newColor, setNewColor] = useState('');
  const [newColorSku, setNewColorSku] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku || '',
        category_id: product.category_id || '',
        moq: product.moq || 1,
        rate: product.rate || 0,
        description: product.description || '',
      });
      setColorVariants([]);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        category_id: '',
        moq: 1,
        rate: 0,
        description: '',
      });
      setColorVariants([]);
    }
    setIsDialogOpen(true);
  };

  const addColorVariant = () => {
    if (!newColor.trim() || !newColorSku.trim()) {
      toast.error('Please fill in color name and SKU');
      return;
    }

    if (colorVariants.some(v => v.color === newColor)) {
      toast.error('Color already added');
      return;
    }

    setColorVariants([...colorVariants, { color: newColor, sku: newColorSku, images: [], previewUrls: [] }]);
    setNewColor('');
    setNewColorSku('');
  };

  const removeColorVariant = (color: string) => {
    setColorVariants(colorVariants.filter(v => v.color !== color));
  };

  const handleImageSelect = (color: string, files: FileList | null) => {
    if (!files) return;

    setColorVariants(
      colorVariants.map(variant => {
        if (variant.color === color) {
          const newImages = [...variant.images, ...Array.from(files)];
          const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
          return { ...variant, images: newImages, previewUrls: newPreviewUrls };
        }
        return variant;
      })
    );
  };

  const removeImage = (color: string, index: number) => {
    setColorVariants(
      colorVariants.map(variant => {
        if (variant.color === color) {
          const newImages = variant.images.filter((_, i) => i !== index);
          const newPreviewUrls = variant.previewUrls.filter((_, i) => i !== index);
          return { ...variant, images: newImages, previewUrls: newPreviewUrls };
        }
        return variant;
      })
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.sku.trim()) {
      toast.error('Product name and SKU are required');
      return;
    }

    if (colorVariants.length === 0) {
      toast.error('Please add at least one color variant');
      return;
    }

    setUploading(true);
    try {
      if (DEMO_MODE) {
        toast.success(editingProduct ? 'Product updated (demo)' : 'Product added (demo)');
      } else {
        if (editingProduct) {
          await supabase
            .from('products')
            .update(formData)
            .eq('id', editingProduct.id);
          toast.success('Product updated');
        } else {
          await supabase.from('products').insert({
            ...formData,
            is_active: true,
          });
          toast.success('Product added');
        }

        // TODO: Upload images to Supabase storage
        // For now, just show success
      }

      setIsDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        if (DEMO_MODE) {
          toast.success('Product deleted (demo)');
        } else {
          await supabase.from('products').delete().eq('id', id);
          toast.success('Product deleted');
        }
        onUpdate();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product');
      }
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const formatPrice = (rate: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(rate);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Manage Products</h2>
          <p className="text-muted-foreground">Add, edit, or remove products</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Product Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Product Information</h3>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Product Name *</label>
                  <Input
                    placeholder="e.g., Flap Pe Chain"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">SKU *</label>
                  <Input
                    placeholder="e.g., ROLEX-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price (₹)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">MOQ</label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={formData.moq}
                      onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Product description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              {/* Color Variants Section */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold text-sm">Color Variants *</h3>
                <p className="text-xs text-muted-foreground">Add colors for this product with their SKU and images</p>

                <div className="grid grid-cols-2 gap-2 items-end">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color Name</label>
                    <Input
                      placeholder="e.g., Black"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color SKU</label>
                    <Input
                      placeholder="e.g., ROLEX-001-BLK"
                      value={newColorSku}
                      onChange={(e) => setNewColorSku(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="button" variant="outline" className="w-full" onClick={addColorVariant}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Color
                </Button>

                {/* Color Variants List */}
                <div className="space-y-4">
                  {colorVariants.map((variant) => (
                    <Card key={variant.color} className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{variant.color}</p>
                            <p className="text-xs text-muted-foreground">SKU: {variant.sku}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColorVariant(variant.color)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Image Upload Section */}
                        <div className="border-t pt-3">
                          <label className="text-xs font-medium mb-2 block">Upload Images</label>
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            disabled={uploading}
                            onChange={(e) => handleImageSelect(variant.color, e.target.files)}
                            className="mb-3"
                          />

                          {/* Image Previews */}
                          {variant.previewUrls.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {variant.previewUrls.map((url, idx) => (
                                <div key={idx} className="relative group">
                                  <img
                                    src={url}
                                    alt={`${variant.color}-${idx}`}
                                    className="w-full h-20 object-cover rounded border"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                    onClick={() => removeImage(variant.color, idx)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    {idx + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {variant.previewUrls.length === 0 && (
                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                              <ImageIcon className="w-6 h-6 text-muted-foreground mx-auto mb-2 opacity-50" />
                              <p className="text-xs text-muted-foreground">No images selected</p>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground mt-2">
                            {variant.images.length} image{variant.images.length !== 1 ? 's' : ''} selected
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {colorVariants.length === 0 && (
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">No colors added yet</p>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 justify-end border-t pt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading || colorVariants.length === 0}>
                  {uploading ? 'Saving...' : editingProduct ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {products.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>{getCategoryName(product.category_id)}</TableCell>
                  <TableCell className="text-amber-600 font-semibold">{formatPrice(product.rate || 0)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
