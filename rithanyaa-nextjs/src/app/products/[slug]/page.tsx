import { notFound } from 'next/navigation'
import { getProductBySlug, getProductsByCategory, getAllProducts } from '@/lib/database'
import ProductPageClient from '@/components/ProductPageClient'
import { Product } from '@/data/products'

// Server-side function to generate static params at build time
export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product: Product) => ({
    slug: product.slug,
  }))
}

// Server-side function to generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} - ${product.category} | Nava Jothi Silks`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Premium Silk Saree`,
      description: product.description,
      images: [product.images[0]],
    },
  }
}

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

// Server Component - handles data fetching and static generation
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    notFound()
  }

  const categoryProducts = await getProductsByCategory(product.category)
  const relatedProducts = categoryProducts
    .filter((p: Product) => p.id !== product.id)
    .slice(0, 4)

  // Pass data to Client Component
  return <ProductPageClient product={product} relatedProducts={relatedProducts} />
}