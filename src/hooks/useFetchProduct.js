import { useState, useEffect } from 'react';

export function useFetchRandomProduct(categoryArray, refreshTrigger) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`https://io3mb1av2d.execute-api.us-east-1.amazonaws.com/dev/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categoryArray }), // Send categoryArray as JSON
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [refreshTrigger, categoryArray]);

  return { product, loading, error };
}