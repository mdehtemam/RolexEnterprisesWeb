import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useQuoteCart } from '@/contexts/QuoteCartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function QuoteCart() {
  const { items, updateQuantity, updateNotes, removeItem, clearCart, createQuote, totalItems } = useQuoteCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestQuote = async () => {
    if (!user) {
      toast.error('Please sign in to submit a quote');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    const { success, error } = await createQuote();
    setIsSubmitting(false);

    if (success) {
      toast.success('Quote request submitted');
      navigate('/dashboard');
    } else {
      toast.error(error?.message || 'Failed to submit quote');
    }
  };

  return (
    <Layout>
      <div className="section-padding container-corporate">
        <h1 className="text-3xl font-bold mb-6">Quote Cart</h1>

        {items.length === 0 ? (
          <p className="text-muted-foreground">Your quote cart is empty. Browse products to add items.</p>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={`${it.productId}-${it.selectedColor}`} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition">
                <img src={it.productImage} alt={it.productName} className="h-20 w-20 object-cover rounded-md" />
                <div className="flex-1">
                  <p className="font-medium">{it.productName}</p>
                  {it.selectedColor && (
                    <p className="text-sm text-muted-foreground">Color: {it.selectedColor}</p>
                  )}
                  <div className="flex gap-2 items-center mt-2">
                    <Input 
                      type="number" 
                      value={it.quantity} 
                      min={1} 
                      onChange={(e) => updateQuantity(it.productId, Number(e.target.value))}
                      className="w-20"
                    />
                    <Input 
                      placeholder="Customization notes" 
                      value={it.customizationNotes} 
                      onChange={(e) => updateNotes(it.productId, e.target.value)}
                    />
                    <Button variant="destructive" onClick={() => removeItem(it.productId)}>Remove</Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <p className="font-medium">Total items: {totalItems}</p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => clearCart()}>Clear</Button>
                <Button onClick={handleRequestQuote} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Request Quote'}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
