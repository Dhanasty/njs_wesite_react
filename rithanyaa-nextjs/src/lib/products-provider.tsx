'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getAllProducts } from '@/lib/database'
import { Product } from '@/data/products'

interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  loading: true,
  error: null,
  refetch: async () => {}
})

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      error,
      refetch: fetchProducts
    }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}

// Helper functions that use the context
export const useAllProducts = () => {
  const { products } = useProducts()
  return products
}

export const useFeaturedProducts = () => {
  const { products } = useProducts()
  return products.filter(product => 
    product.badge === 'Featured' || product.badge === 'Bestseller'
  ).slice(0, 4)
}

export const useProductsByCategory = (category: string) => {
  const { products } = useProducts()
  return products.filter(product => product.category === category)
}

export const useProductBySlug = (slug: string) => {
  const { products } = useProducts()
  return products.find(product => product.slug === slug)
}