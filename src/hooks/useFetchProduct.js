import { useState, useEffect } from 'react';

export function useFetchRandomProduct(categoryArray, refreshTrigger) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);

        const API_URL = "https://hzka2ob147.execute-api.us-east-1.amazonaws.com/dev/get_outfit_data";
        
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryArray: categoryArray, 
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        setProduct({
          imageUrl1: data.imageUrls[0], 
          imageUrl4: data.imageUrls[1], 
          productName: data.productName,
          designerName: data.designerName,
          productPrice: data.productPrice,
          productId: data.productId,
        });
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [refreshTrigger]);

  return { product, loading, error };
}
