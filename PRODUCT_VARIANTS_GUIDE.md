# Product Color Variants & SKU Management System

## Overview

This update enhances the product management system with support for different product images for each color variant and SKU-based search functionality on the admin dashboard.

## New Features

### 1. Product Variants with Color-Specific Images
- Each product can now have multiple color variants
- Each color variant has its own unique SKU (Stock Keeping Unit)
- Each variant can have a dedicated image URL
- Better organization of products with multiple color options

### 2. SKU Field for Products
- Added `sku` field to the `products` table for main product identification
- Example: `PCB-2777` for Premium Corporate Backpack

### 3. Product Variants Table
- New `product_variants` table stores color-specific information
- Structure:
  - `id`: Unique variant identifier
  - `product_id`: References parent product
  - `color`: Color name (e.g., "Black", "Navy", "Red")
  - `sku`: Variant-specific SKU (e.g., `PCB-2777-BLK`)
  - `image_url`: Image URL for this specific color
  - `created_at` / `updated_at`: Timestamps

### 4. Enhanced Admin Dashboard

#### SKU Search Feature
- Search bar on the Products tab to quickly find products
- Searches by:
  - Product SKU (exact match)
  - Product name (substring match)
- Real-time filtering as you type

#### Color Variant Management
- When adding/editing a product, manage color variants directly
- For each color:
  - Enter color name
  - Enter color-specific SKU
- View all variants with their SKUs in the product card
- Thumbnail images displayed for each variant (when available)

## Database Schema Changes

### New Migration: `20260122_add_product_variants.sql`

```sql
-- Add SKU field to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE;

-- Create product_variants table
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

-- Create indexes for fast lookups
CREATE INDEX idx_product_sku ON public.products(sku);
CREATE INDEX idx_variant_sku ON public.product_variants(sku);
CREATE INDEX idx_variant_product_id ON public.product_variants(product_id);
```

## Admin Panel UI Updates

### Products Tab Layout
```
[Search Bar] ..................... [Add Product Button]
+------ Product Cards ------+
| Name                      |
| SKU: PCB-2777            |
| Description              |
| Details (MOQ, Material)   |
|                          |
| Color Variants:          |
| [Black] SKU: PCB-2777-BLK |
| [Navy]  SKU: PCB-2777-NVY |
| [Red]   SKU: PCB-2777-RED |
|                          |
| [Edit] [Delete]          |
+-------------------------+
```

### Add/Edit Product Form
1. **Basic Info**
   - Product Name
   - Product SKU
   - Description
   - Category
   - MOQ & Rate

2. **Specifications**
   - Material
   - Size
   - Capacity

3. **Color Variants** (New)
   - Color name input
   - Color-specific SKU input
   - Add Variant button
   - Display list of added variants with option to remove

## Mock Data Updates

The mock data now includes:
- 3 sample products with SKUs
- 7 color variants across the products
- Example variant structure:
  ```javascript
  {
    id: 'variant-1',
    product_id: 'product-1',
    color: 'Black',
    sku: 'PCB-2777-BLK',
    image_url: 'https://via.placeholder.com/300x300?text=Black+Backpack',
  }
  ```

## TypeScript Types Updated

### Product Table
- Added `sku: string | null` field

### New ProductVariant Type
```typescript
product_variants: {
  Row: {
    color: string
    created_at: string
    id: string
    image_url: string | null
    product_id: string
    sku: string
    updated_at: string
  }
  // Insert and Update types included
}
```

### ProductImage Table
- Added optional `variant_id` field to link images to specific variants
- Maintained backward compatibility with product-level images

## How to Use

### Adding a New Product with Variants

1. Click "Add Product" button
2. Fill in product details:
   - Name: "Premium Corporate Backpack"
   - SKU: "PCB-2777"
   - Description and specifications
3. Add color variants:
   - Color: "Black" → SKU: "PCB-2777-BLK"
   - Color: "Navy" → SKU: "PCB-2777-NVY"
   - Color: "Red" → SKU: "PCB-2777-RED"
4. Click "Add Product"

### Searching for Products

1. On the Products tab, use the search bar
2. Type SKU: "PCB-2777" or product name: "Backpack"
3. Results filter in real-time

### Editing Product Variants

1. Click "Edit" on a product
2. Modify variant SKUs or colors
3. Add new variants or remove existing ones
4. Click "Update Product"

## Implementation Details

### Files Modified

1. **Database**
   - New migration: `supabase/migrations/20260122_add_product_variants.sql`

2. **Types**
   - Updated: `src/integrations/supabase/types.ts`
     - Added `sku` to products table
     - Added new `product_variants` table type
     - Updated `product_images` table relations

3. **Mock Data**
   - Updated: `src/integrations/supabase/mockData.ts`
     - Added SKU to existing products
     - Added new `MOCK_PRODUCT_VARIANTS` export

4. **Admin Page**
   - Updated: `src/pages/Admin.tsx`
     - Added SKU search functionality
     - Refactored color management to variant-based system
     - Enhanced product card UI to display variants with images
     - Improved form for managing variants with SKUs

### State Management

New state variables in Admin component:
- `variants`: Array of ProductVariant objects
- `colorVariants`: Temporary array for form editing
- `searchSku`: Current search query
- `filteredProducts`: Products matching search criteria
- `newColor` & `newColorSku`: Form inputs for adding variants

### API Integration

When not in DEMO_MODE:
- Fetches from `product_variants` table
- Creates/updates variants in the database
- Indexes available for fast SKU lookups

## Benefits

✅ **Better Organization**: Separate images for each color variant  
✅ **Easy Search**: Find products quickly by SKU  
✅ **Cleaner UI**: Color variants shown with their specific SKUs  
✅ **Scalability**: Support for unlimited color variants per product  
✅ **User Experience**: Improved admin interface for product management  
✅ **Data Integrity**: Unique SKUs prevent duplicates  

## Next Steps (Optional Enhancements)

1. Add image upload for each variant directly in the form
2. Display variants with different images on the customer-facing site
3. Allow customers to select color variant when adding to quote
4. Add variant-specific pricing
5. Add inventory tracking per variant
6. Bulk edit variants
