import { useState, useEffect } from 'react';

export function useFetchRandomProduct(categoryArray) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const randomCategory = categoryArray[Math.floor(Math.random() * categoryArray.length)];
        console.log("Fetching category:", randomCategory);
        const response = await fetch(`https://api.shopbop.com/categories/${randomCategory}/products`);
        const data = await response.json();
        console.log("Fetched data:", data);
        const products = data.products;
        
        if (products && products.length > 0) {
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          const productName = randomProduct.shortDescription;
          const productPrice = randomProduct.price.retail;
          const imageUrl = `https://m.media-amazon.com/images/G/01/Shopbop/p${randomProduct.colors[0].images[0].src}`;
          setProduct({ imageUrl, productName, productPrice });
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, []);

  return { product, loading, error};
}