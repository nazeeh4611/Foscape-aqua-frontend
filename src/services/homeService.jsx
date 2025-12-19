import apiClient from './apiService';

const CACHE_KEY_PREFIX = 'foscape:home:';

const getCacheKey = (component, params = {}) => {
  if (Object.keys(params).length === 0) return `${CACHE_KEY_PREFIX}${component}`;
  
  const sortedParams = Object.keys(params)
    .sort()
    .filter(key => params[key])
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
    
  return `${CACHE_KEY_PREFIX}${component}:${sortedParams}`;
};

// Category API calls
export const fetchCategories = async () => {
  try {


    const cacheKey = getCacheKey('categories');
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return { data, fromCache: true };
      }
    }

    const response = await apiClient.get('user/category');
    console.log("may heree")

    console.log("resposne",response)
    
    if (response.data && response.data.success) {
      const data = response.data.categories || [];
      
      // Store in session storage
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      // Also store in local storage for next session
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return { data, fromCache: false };
    }
    
    return { data: [], fromCache: false };
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Try to get from local storage as fallback
    const cacheKey = getCacheKey('categories');
    const fallback = localStorage.getItem(cacheKey);
    if (fallback) {
      const { data } = JSON.parse(fallback);
      return { data, fromCache: true };
    }
    
    return { data: [], fromCache: false, error };
  }
};

// Featured Products API calls
export const fetchFeaturedProducts = async (limit = 12) => {
  try {
    const cacheKey = getCacheKey('featured-products', { limit });
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return { data, fromCache: true };
      }
    }

    const response = await apiClient.get(`user/products/featured?limit=${limit}`);
    
    if (response.data && response.data.success) {
      const data = response.data.products || [];
      
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return { data, fromCache: false };
    }
    
    return { data: [], fromCache: false };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    
    const cacheKey = getCacheKey('featured-products', { limit });
    const fallback = localStorage.getItem(cacheKey);
    if (fallback) {
      const { data } = JSON.parse(fallback);
      return { data, fromCache: true };
    }
    
    return { data: [], fromCache: false, error };
  }
};

// Featured Portfolios API calls
export const fetchFeaturedPortfolios = async () => {
  try {
    const cacheKey = getCacheKey('featured-portfolios');
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 10 * 60 * 1000) { // 10 minutes for portfolios
        return { data, fromCache: true };
      }
    }

    const response = await apiClient.get('user/portfolios/featured');
    
    if (response.data && response.data.success) {
      const data = response.data.portfolios || [];
      
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return { data, fromCache: false };
    }
    
    return { data: [], fromCache: false };
  } catch (error) {
    console.error('Error fetching featured portfolios:', error);
    
    const cacheKey = getCacheKey('featured-portfolios');
    const fallback = localStorage.getItem(cacheKey);
    if (fallback) {
      const { data } = JSON.parse(fallback);
      return { data, fromCache: true };
    }
    
    return { data: [], fromCache: false, error };
  }
};

// Batch data for parallel fetching
export const fetchBatchData = async (components = ['categories', 'featured']) => {
  try {
    const include = components.join(',');
    const cacheKey = getCacheKey('batch-data', { include });
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return { ...data, fromCache: true };
      }
    }

    const response = await apiClient.get(`user/batch-data?include=${include}`);
    
    if (response.data && response.data.success) {
      const data = {
        categories: response.data.categories || [],
        featuredProducts: response.data.featuredProducts || [],
        portfolios: response.data.portfolios || []
      };
      
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return { ...data, fromCache: false };
    }
    
    return { categories: [], featuredProducts: [], portfolios: [], fromCache: false };
  } catch (error) {
    console.error('Error fetching batch data:', error);
    
    // Return empty data with cache flag
    return { 
      categories: [], 
      featuredProducts: [], 
      portfolios: [], 
      fromCache: false, 
      error 
    };
  }
};