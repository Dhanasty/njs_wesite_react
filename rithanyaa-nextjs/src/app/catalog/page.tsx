import Image from 'next/image'
import { getAllProducts } from '@/lib/database'
import { Product } from '@/data/products'
import CatalogClient from './CatalogClient'

// Define types for transformed products
interface TransformedProduct {
  id: number
  slug: string
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  categoryName: string
  rating: number
  reviews: number
  badge: string
  description: string
  colors: string[]
  material: string
}

interface FilterCategory {
  id: string
  name: string
  count: number
}

// Transform products data for catalog display
async function getTransformedProducts(): Promise<TransformedProduct[]> {
  const products = await getAllProducts()
  return products.map((product: any) => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  price: product.price,
  originalPrice: product.originalPrice,
  image: product.images[0],
  category: product.category.toLowerCase().replace(/\s+/g, '-'),
  categoryName: product.category,
  rating: 4.8, // Default rating for now
  reviews: Math.floor(Math.random() * 200) + 50, // Random reviews for display
  badge: product.badge || 'Quality',
  description: product.description.slice(0, 50) + '...',
  colors: product.colors?.map((c: any) => c.name) || [],
  material: product.specifications?.fabric || 'Silk'
}))
}

function getFilterCategories(allProducts: TransformedProduct[]): FilterCategory[] {
  return [
    { id: 'all', name: 'All Products', count: allProducts.length },
    { id: 'chettinad-silks', name: 'Chettinad Silks', count: allProducts.filter((p: TransformedProduct) => p.category === 'chettinad-silks').length },
    { id: 'soft-sico', name: 'Soft Sico', count: allProducts.filter((p: TransformedProduct) => p.category === 'soft-sico').length },
    { id: 'ikath', name: 'Ikath', count: allProducts.filter((p: TransformedProduct) => p.category === 'ikath').length }
  ]
}

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'newest', name: 'Newest First' }
]

export default async function CatalogPage() {
  const allProducts = await getTransformedProducts()
  const filterCategories = getFilterCategories(allProducts)
  
  return <CatalogClient allProducts={allProducts} filterCategories={filterCategories} />
}