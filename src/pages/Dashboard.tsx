import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';

interface Quote {
  id: string;
  status: string;
  created_at: string;
  notes: string;
}

export default function Dashboard() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchQuotes();
  }, [user]);

  async function fetchQuotes() {
    const { data } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setQuotes(data);
    setIsLoading(false);
  }

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-corporate">
          <h1 className="text-3xl font-bold mb-2">Corporate Dashboard</h1>
          <p className="text-muted-foreground mb-8">Welcome back, {profile?.name}</p>

          <div className="card-corporate p-6">
            <h2 className="text-xl font-semibold mb-4">Your Quote Requests</h2>
            
            {isLoading ? (
              <p>Loading...</p>
            ) : quotes.length === 0 ? (
              <p className="text-muted-foreground">No quotes yet. Browse products to create one!</p>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Quote #{quote.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`status-badge status-${quote.status}`}>
                      {quote.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
