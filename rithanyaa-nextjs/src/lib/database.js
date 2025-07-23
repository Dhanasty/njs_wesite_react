// API client for connecting to admin dashboard backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/public';

// Simple cache to reduce API calls
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

async function fetchAPI(endpoint) {
  // Check cache first
  const cacheKey = endpoint;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'API request failed');
    }
    
    // Cache the result
    cache.set(cacheKey, {
      data: result.data,
      timestamp: Date.now()
    });
    
    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Product data access functions that connect to admin dashboard
export async function getAllProducts() {
  try {
    return await fetchAPI('/products');
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug) {
  try {
    return await fetchAPI(`/products/slug/${slug}`);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function getProductsByCategory(category) {
  try {
    return await fetchAPI(`/products/category/${encodeURIComponent(category)}`);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    return await fetchAPI('/products/featured');
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}