-- Add rate column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS rate decimal(10, 2);

-- Create contacts table for supplier inquiries
CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  message text NOT NULL,
  status varchar(20) DEFAULT 'pending',
  admin_response text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_product_id ON contacts(product_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- Enable RLS on contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contacts
-- Users can see their own contacts
CREATE POLICY "Users can view their own contacts" ON contacts
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can see all contacts
CREATE POLICY "Admins can view all contacts" ON contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  );

-- Users can create contacts
CREATE POLICY "Users can create contacts" ON contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can update contacts
CREATE POLICY "Admins can update contacts" ON contacts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  );
