export interface Product {
  id: number
  slug: string
  name: string
  price: number
  originalPrice: number
  images: string[]
  category: 'Chettinad Silks' | 'Soft Sico' | 'Ikath'
  badge?: 'Featured' | 'Bestseller' | 'New' | 'Premium'
  description: string
  features: string[]
  colors: Array<{
    name: string
    value: string
    image: string
  }>
  specifications: {
    fabric: string
    length: string
    width: string
    weight: string
    washCare: string[]
  }
  inStock: boolean
}

export const products: Product[] = [
  // Chettinad Silks
  {
    id: 1,
    slug: 'ivory-chettinad-silk',
    name: 'Ivory - Chettinad Silk',
    price: 3455,
    originalPrice: 4200,
    images: [
      '/images/products/chettinad1.jpg',
      '/images/products/chettinad1-detail1.jpg',
      '/images/products/chettinad1-detail2.jpg',
      '/images/products/chettinad1-detail3.jpg'
    ],
    category: 'Chettinad Silks',
    badge: 'Featured',
    description: 'Exquisite ivory Chettinad silk saree featuring traditional handwoven patterns. This timeless piece showcases the rich heritage of Tamil Nadu\'s textile craftsmanship with intricate motifs and lustrous silk finish.',
    features: [
      'Authentic handwoven Chettinad silk',
      'Traditional Tamil Nadu craftsmanship',
      'Rich lustrous finish',
      'Intricate geometric patterns',
      'Premium quality silk threads'
    ],
    colors: [
      { name: 'Ivory', value: '#F5F5DC', image: '/images/products/chettinad1.jpg' },
      { name: 'Golden Yellow', value: '#FFD700', image: '/images/products/chettinad1-yellow.jpg' },
      { name: 'Deep Red', value: '#8B0000', image: '/images/products/chettinad1-red.jpg' }
    ],
    specifications: {
      fabric: 'Pure Chettinad Silk',
      length: '5.5 meters + 80cm blouse piece',
      width: '44 inches',
      weight: '700 grams',
      washCare: ['Dry clean only', 'Store in cotton cloth', 'Avoid direct sunlight']
    },
    inStock: true
  },
  {
    id: 2,
    slug: 'maroon-chettinad-classic',
    name: 'Maroon Chettinad Classic',
    price: 4299,
    originalPrice: 5100,
    images: [
      '/images/products/chettinad2.jpg',
      '/images/products/chettinad2-detail1.jpg',
      '/images/products/chettinad2-detail2.jpg'
    ],
    category: 'Chettinad Silks',
    badge: 'Premium',
    description: 'Rich maroon Chettinad silk saree with gold zari work. Perfect for weddings and special occasions, featuring traditional checks and temple border designs.',
    features: [
      'Gold zari work',
      'Traditional check patterns',
      'Temple border design',
      'Wedding collection',
      'Handwoven excellence'
    ],
    colors: [
      { name: 'Maroon', value: '#800000', image: '/images/products/chettinad2.jpg' },
      { name: 'Royal Blue', value: '#4169E1', image: '/images/products/chettinad2-blue.jpg' }
    ],
    specifications: {
      fabric: 'Pure Chettinad Silk with Zari',
      length: '5.5 meters + 80cm blouse piece',
      width: '44 inches',
      weight: '750 grams',
      washCare: ['Dry clean only', 'Handle zari work carefully', 'Store flat']
    },
    inStock: true
  },

  // Soft Sico
  {
    id: 3,
    slug: 'elegant-soft-sico',
    name: 'Elegant Soft Sico',
    price: 2499,
    originalPrice: 3100,
    images: [
      '/images/products/softsico1.jpg',
      '/images/products/softsico1-detail1.jpg',
      '/images/products/softsico1-detail2.jpg'
    ],
    category: 'Soft Sico',
    badge: 'Bestseller',
    description: 'Luxurious soft sico saree with contemporary designs. Perfect blend of comfort and elegance, ideal for both casual and formal occasions.',
    features: [
      'Ultra-soft texture',
      'Contemporary design',
      'Versatile styling',
      'Comfortable drape',
      'Easy maintenance'
    ],
    colors: [
      { name: 'Powder Blue', value: '#B0E0E6', image: '/images/products/softsico1.jpg' },
      { name: 'Mint Green', value: '#98FB98', image: '/images/products/softsico1-mint.jpg' },
      { name: 'Rose Pink', value: '#FFB6C1', image: '/images/products/softsico1-pink.jpg' }
    ],
    specifications: {
      fabric: 'Soft Sico Silk',
      length: '5.5 meters + 80cm blouse piece',
      width: '44 inches',
      weight: '500 grams',
      washCare: ['Hand wash in cold water', 'Mild detergent only', 'Dry in shade']
    },
    inStock: true
  },
  {
    id: 4,
    slug: 'floral-soft-sico',
    name: 'Floral Soft Sico',
    price: 2899,
    originalPrice: 3500,
    images: [
      '/images/products/softsico2.jpg',
      '/images/products/softsico2-detail1.jpg'
    ],
    category: 'Soft Sico',
    description: 'Beautiful floral printed soft sico saree with vibrant colors. Perfect for day events and casual gatherings.',
    features: [
      'Digital floral prints',
      'Vibrant color combinations',
      'Lightweight fabric',
      'Modern appeal',
      'Color-fast printing'
    ],
    colors: [
      { name: 'Multi Floral', value: '#FF69B4', image: '/images/products/softsico2.jpg' }
    ],
    specifications: {
      fabric: 'Printed Soft Sico',
      length: '5.5 meters + 80cm blouse piece',
      width: '44 inches',
      weight: '450 grams',
      washCare: ['Machine wash gentle', 'Use color-safe detergent', 'Iron on low heat']
    },
    inStock: true
  },

  // Ikath
  {
    id: 5,
    slug: 'traditional-ikath',
    name: 'Traditional Ikath',
    price: 2365,
    originalPrice: 2800,
    images: [
      '/images/products/ikath1.jpg',
      '/images/products/ikath1-detail1.jpg',
      '/images/products/ikath1-detail2.jpg'
    ],
    category: 'Ikath',
    badge: 'New',
    description: 'Authentic Ikath saree featuring traditional tie-dye technique. Each piece is unique with beautiful geometric patterns created through resist dyeing.',
    features: [
      'Traditional tie-dye technique',
      'Unique geometric patterns',
      'Artisan crafted',
      'Cultural heritage',
      'Natural dyeing process'
    ],
    colors: [
      { name: 'Indigo Blue', value: '#4B0082', image: '/images/products/ikath1.jpg' },
      { name: 'Emerald Green', value: '#50C878', image: '/images/products/ikath1-green.jpg' }
    ],
    specifications: {
      fabric: 'Pure Cotton Ikath',
      length: '5.5 meters + 80cm blouse piece',
      width: '44 inches',
      weight: '600 grams',
      washCare: ['Hand wash separately', 'Use mild detergent', 'Dry in shade to preserve colors']
    },
    inStock: true
  },
  {
    id: 6,
    slug: 'designer-ikath',
    name: 'Designer Ikath',
    price: 4299,
    originalPrice: 5200,
    images: [
      '/images/products/ikath2.jpg',
      '/images/products/ikath2-detail1.jpg',
      '/images/products/ikath2-detail2.jpg'
    ],
    category: 'Ikath',
    badge: 'Premium',
    description: 'Premium designer Ikath saree with contemporary patterns. Combines traditional tie-dye technique with modern design sensibilities.',
    features: [
      'Designer patterns',
      'Contemporary appeal',
      'Premium quality fabric',
      'Artistic excellence',
      'Limited edition'
    ],
    colors: [
      { name: 'Burgundy', value: '#800020', image: '/images/products/ikath2.jpg' },
      { name: 'Navy Blue', value: '#000080', image: '/images/products/ikath2-navy.jpg' }
    ],
    specifications: {
      fabric: 'Premium Cotton Silk Ikath',
      length: '5.5 meters + 80cm blouse piece',
      width: '44 inches',
      weight: '650 grams',
      washCare: ['Dry clean recommended', 'Store carefully', 'Avoid harsh chemicals']
    },
    inStock: true
  },

  // Additional products to expand catalog
  {
    id: 7,
    slug: 'royal-chettinad-silk',
    name: 'Royal Chettinad Silk',
    price: 5999,
    originalPrice: 7200,
    images: [
      '/images/products/chettinad3.jpg',
      '/images/products/chettinad3-detail1.jpg'
    ],
    category: 'Chettinad Silks',
    badge: 'Premium',
    description: 'Luxurious royal Chettinad silk saree with heavy zari work. Perfect for grand occasions and celebrations.',
    features: [
      'Heavy zari embellishment',
      'Royal collection',
      'Grand occasion wear',
      'Intricate craftsmanship',
      'Premium silk quality'
    ],
    colors: [
      { name: 'Royal Purple', value: '#7851A9', image: '/images/products/chettinad3.jpg' }
    ],
    specifications: {
      fabric: 'Premium Chettinad Silk with Heavy Zari',
      length: '5.5 meters + 80cm blouse piece',
      width: '44 inches',
      weight: '850 grams',
      washCare: ['Dry clean only', 'Professional care recommended', 'Store with care']
    },
    inStock: true
  },
  {
    id: 8,
    slug: 'pastel-soft-sico',
    name: 'Pastel Soft Sico',
    price: 2199,
    originalPrice: 2700,
    images: [
      '/images/products/softsico3.jpg'
    ],
    category: 'Soft Sico',
    description: 'Delicate pastel soft sico saree with subtle embellishments. Perfect for daytime events and summer occasions.',
    features: [
      'Pastel color palette',
      'Subtle embellishments',
      'Summer collection',
      'Lightweight comfort',
      'Elegant simplicity'
    ],
    colors: [
      { name: 'Lavender', value: '#E6E6FA', image: '/images/products/softsico3.jpg' },
      { name: 'Peach', value: '#FFCBA4', image: '/images/products/softsico3-peach.jpg' }
    ],
    specifications: {
      fabric: 'Soft Sico with Light Embellishments',
      length: '5.5 meters + 80cm blouse piece',
      width: '44 inches',
      weight: '480 grams',
      washCare: ['Gentle hand wash', 'Mild detergent', 'Air dry in shade']
    },
    inStock: true
  }
]

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug)
}

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category)
}

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.badge === 'Featured' || product.badge === 'Bestseller').slice(0, 4)
}