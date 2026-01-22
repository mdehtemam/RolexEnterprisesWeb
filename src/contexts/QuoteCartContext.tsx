import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface QuoteItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  customizationNotes: string;
  moq: number;
  selectedColor?: string;
}

interface QuoteCartContextType {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, 'quantity' | 'customizationNotes'> & { quantity?: number; customizationNotes?: string; selectedColor?: string }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  totalItems: number;
  createQuote: (notes?: string) => Promise<{ success: boolean; error?: Error }>;
}

const QuoteCartContext = createContext<QuoteCartContextType | undefined>(undefined);

export function QuoteCartProvider({ children }: { children: ReactNode }) {
  const { profile, user } = useAuth();
  const [items, setItems] = useState<QuoteItem[]>(() => {
    const saved = localStorage.getItem('quoteCart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('quoteCart', JSON.stringify(items));
  }, [items]);

  function addItem(item: Omit<QuoteItem, 'quantity' | 'customizationNotes'> & { quantity?: number; customizationNotes?: string; selectedColor?: string }) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.selectedColor === item.selectedColor);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.selectedColor === item.selectedColor
            ? { ...i, quantity: i.quantity + (item.quantity || item.moq) }
            : i
        );
      }
      return [
        ...prev,
        {
          ...item,
          quantity: item.quantity || item.moq,
          customizationNotes: item.customizationNotes || '',
          selectedColor: item.selectedColor || '',
        },
      ];
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }

  function updateNotes(productId: string, notes: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, customizationNotes: notes } : i
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  async function createQuote(notes?: string) {
    try {
      // Require authenticated user
      if (!user || !profile) {
        return { success: false, error: new Error('User must be signed in to create a quote') };
      }

      // Insert quote
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert({ user_id: profile.user_id, status: 'Pending', notes })
        .select()
        .single();

      if (quoteError || !quoteData) {
        return { success: false, error: quoteError ?? new Error('Failed to create quote') };
      }

      const quoteId = quoteData.id;

      // Prepare quote items
      const itemsToInsert = items.map((it) => ({
        quote_id: quoteId,
        product_id: it.productId,
        quantity: it.quantity,
        customization_notes: it.customizationNotes || null,
      }));

      const { error: itemsError } = await supabase.from('quote_items').insert(itemsToInsert);

      if (itemsError) {
        return { success: false, error: itemsError };
      }

      // Clear local cart on success
      setItems([]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e as Error };
    }
  }

  return (
    <QuoteCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
        totalItems,
          createQuote,
      }}
    >
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);
  if (context === undefined) {
    throw new Error('useQuoteCart must be used within a QuoteCartProvider');
  }
  return context;
}
