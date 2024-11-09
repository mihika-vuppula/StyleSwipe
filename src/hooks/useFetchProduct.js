import { useState, useEffect } from 'react';

export function useFetchRandomProduct(categoryArray, refreshTrigger) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const randomCategory = categoryArray[Math.floor(Math.random() * categoryArray.length)];
        const response = await fetch(`https://api.shopbop.com/categories/${randomCategory}/products`);
        const data = await response.json();
        const products = data.products;
        
        if (products && products.length > 0) {
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          const productName = randomProduct.shortDescription;
          const designerName = randomProduct.designerName;
          const productPrice = randomProduct.price.retail;
          const imageUrl1 = `https://m.media-amazon.com/images/G/01/Shopbop/p${randomProduct.colors[0].images[0].src}`;
          const imageUrl4 = `https://m.media-amazon.com/images/G/01/Shopbop/p${randomProduct.colors[0].images[3].src}`;

          setProduct({ imageUrl1, imageUrl4, productName, designerName, productPrice });
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [refreshTrigger]);

  return { product, loading, error };
}
