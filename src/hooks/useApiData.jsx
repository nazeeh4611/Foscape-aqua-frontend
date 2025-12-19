import { useState, useEffect, useCallback } from 'react';

const useApiData = (fetchFunction, dependencies = [], initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      
      setData(result.data);
      setFromCache(result.fromCache || false);
      
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error in useApiData:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const retry = () => {
    fetchData();
  };

  return { data, loading, error, fromCache, retry };
};

export default useApiData;