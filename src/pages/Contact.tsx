import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await supabase.from('contacts').insert({ name, phone, company, message });
      toast.success('Message sent. We will contact you shortly.');
      setName(''); setPhone(''); setCompany(''); setMessage('');
    } catch (err) {
      toast.error('Failed to send message');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Layout>
      <div className="section-padding container-corporate">
        <h1 className="text-3xl font-bold mb-4">Request a Quote / Contact Us</h1>
        <p className="text-muted-foreground mb-6">Fill out the form and our sales team will get back to you about bulk pricing and customization.</p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="company">Company / Organization</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="message">Details / Requirements</Label>
            <textarea id="message" className="w-full p-2 border rounded-md" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>

          <div>
            <Button type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send Request'}</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
