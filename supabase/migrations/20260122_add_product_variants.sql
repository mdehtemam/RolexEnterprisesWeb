-- Add SKU field to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE;

-- Create product_variants table for color-specific images and details
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color VARCHAR(100) NOT NULL,
  sku VARCHAR(100) NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(product_id, color)
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON public.product_variants;
DROP POLICY IF EXISTS "Only admins can manage product variants" ON public.product_variants;

CREATE POLICY "Product variants are viewable by everyone" 
  ON public.product_variants FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage product variants" 
  ON public.product_variants FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  );

-- Create index for faster SKU lookups
CREATE INDEX IF NOT EXISTS idx_product_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_variant_sku ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variant_product_id ON public.product_variants(product_id);

-- Update product_images to optionally reference variants
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE;

-- Create index for variant images
CREATE INDEX IF NOT EXISTS idx_product_images_variant_id ON public.product_images(variant_id);
