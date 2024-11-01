import { useState, useEffect } from 'react';

export function useFetchRandomProduct(categoryArray, refreshTrigger) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchProduct() {
      try {
        setLoading(true);
        const randomCategory = categoryArray[Math.floor(Math.random() * categoryArray.length)];
        
        // Add timestamp and random string to ensure different products
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        
        const productResponse = await fetch('https://io3mb1av2d.execute-api.us-east-1.amazonaws.com/dev/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categoryArray: [randomCategory],
            timestamp: timestamp,
            randomSeed: randomString
          })
        });

        if (!productResponse.ok) {
          throw new Error('Failed to fetch product data');
        }

        const productData = await productResponse.json();
        
        if (productData && productData.body) {
          const parsedData = typeof productData.body === 'string' ? JSON.parse(productData.body) : productData.body;

          // Generate unique image keys with category and product info
          const imageKey1 = `product-images/${randomCategory}/${timestamp}_${randomString}_1.jpg`;
          const imageKey4 = `product-images/${randomCategory}/${timestamp}_${randomString}_4.jpg`;

          // Cache the images with organized keys
          await fetch('https://io3mb1av2d.execute-api.us-east-1.amazonaws.com/dev/cache-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl1: parsedData.imageUrl1,
              imageUrl4: parsedData.imageUrl4,
              imageKey1: imageKey1,
              imageKey4: imageKey4
            })
          });

          if (isMounted) {
            setProduct({
              ...parsedData,
              imageKey1,
              imageKey4
            });
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    const timeoutId = setTimeout(() => {
      fetchProduct();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [refreshTrigger]);

  return { product, loading, error };
}
