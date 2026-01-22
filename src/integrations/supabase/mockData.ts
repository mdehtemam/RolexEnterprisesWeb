// Mock data for demo/development mode
export const MOCK_USER = {
  id: 'demo-user-123',
  email: '9654303184@rolex-enterprises.com',
  phone: '9654303184',
  created_at: new Date().toISOString(),
};

export const MOCK_PROFILE = {
  id: 'profile-123',
  user_id: MOCK_USER.id,
  name: 'Md Ehtemam',
  phone: '9654303184',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const MOCK_CATEGORIES = [
  { id: '1', name: 'Backpacks', description: 'Corporate backpacks and bags', icon: '🎒', created_at: new Date().toISOString() },
  { id: '2', name: 'Shoulder Bags', description: 'Promotional shoulder bags', icon: '👜', created_at: new Date().toISOString() },
  { id: '3', name: 'Trolley Bags', description: 'Travel and luggage bags', icon: '🧳', created_at: new Date().toISOString() },
  { id: '4', name: 'Sling Bags', description: 'Crossbody and sling bags', icon: '📱', created_at: new Date().toISOString() },
  { id: '5', name: 'Laptop Bags', description: 'Professional laptop bags', icon: '💼', created_at: new Date().toISOString() },
  { id: '6', name: 'Tote Bags', description: 'Large capacity tote bags', icon: '🛍️', created_at: new Date().toISOString() },
];

export const MOCK_PRODUCTS = [
  {
    id: 'product-1',
    name: 'Premium Corporate Backpack',
    description: 'High-quality corporate backpack with custom branding',
    category_id: '1',
    moq: 50,
    rate: 25.99,
    colors: ['Black', 'Navy', 'Red'],
    material: 'Polyester',
    size: '18x10x35cm',
    capacity: '30L',
    sku: 'PCB-2777',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'product-2',
    name: 'Laptop Messenger Bag',
    description: 'Professional messenger bag for laptops',
    category_id: '5',
    moq: 100,
    rate: 35.50,
    colors: ['Black', 'Gray'],
    material: 'Canvas',
    size: '15x5x40cm',
    capacity: 'Fits 15 inch laptop',
    sku: 'LMB-3203',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'product-3',
    name: 'Travel Trolley Bag',
    description: 'Durable travel bag with wheels',
    category_id: '3',
    moq: 25,
    rate: 49.99,
    colors: ['Black', 'Blue'],
    material: 'Nylon',
    size: '55x35x25cm',
    capacity: '80L',
    sku: 'TTB-4501',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock product variants with different colors and their images
export const MOCK_PRODUCT_VARIANTS = [
  // Product 1 variants
  {
    id: 'variant-1',
    product_id: 'product-1',
    color: 'Black',
    sku: 'PCB-2777-BLK',
    image_url: 'https://via.placeholder.com/300x300?text=Black+Backpack',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'variant-2',
    product_id: 'product-1',
    color: 'Navy',
    sku: 'PCB-2777-NVY',
    image_url: 'https://via.placeholder.com/300x300?text=Navy+Backpack',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'variant-3',
    product_id: 'product-1',
    color: 'Red',
    sku: 'PCB-2777-RED',
    image_url: 'https://via.placeholder.com/300x300?text=Red+Backpack',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Product 2 variants
  {
    id: 'variant-4',
    product_id: 'product-2',
    color: 'Black',
    sku: 'LMB-3203-BLK',
    image_url: 'https://via.placeholder.com/300x300?text=Black+Messenger',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'variant-5',
    product_id: 'product-2',
    color: 'Gray',
    sku: 'LMB-3203-GRY',
    image_url: 'https://via.placeholder.com/300x300?text=Gray+Messenger',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Product 3 variants
  {
    id: 'variant-6',
    product_id: 'product-3',
    color: 'Black',
    sku: 'TTB-4501-BLK',
    image_url: 'https://via.placeholder.com/300x300?text=Black+Trolley',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'variant-7',
    product_id: 'product-3',
    color: 'Blue',
    sku: 'TTB-4501-BLU',
    image_url: 'https://via.placeholder.com/300x300?text=Blue+Trolley',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
