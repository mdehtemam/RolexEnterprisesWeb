import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface QuoteItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  customizationNotes: string;
  moq: number;
}

interface QuoteCartContextType {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, 'quantity' | 'customizationNotes'> & { quantity?: number; customizationNotes?: string }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const QuoteCartContext = createContext<QuoteCartContextType | undefined>(undefined);

export function QuoteCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>(() => {
    const saved = localStorage.getItem('quoteCart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('quoteCart', JSON.stringify(items));
  }, [items]);

  function addItem(item: Omit<QuoteItem, 'quantity' | 'customizationNotes'> & { quantity?: number; customizationNotes?: string }) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
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
