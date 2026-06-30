"use client"

import React, { useState, useEffect } from 'react';
import styles from './ProductList.module.css';
import { Product } from '@/Types/product';
import ProductTable from './ProductTable';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchProducts = async () => {
    fetch('/api/products/get/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // console.log(data);
        setProducts(data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setError("Failed to load products.");
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchProducts()
  }, []);

  const handleEditProduct = (id: string) => {
    // console.log(`Edit product with ID: ${id}`);
    // Implement navigation to an edit page or open a modal
    alert(`Editing product ${id}`);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm(`Are you sure you want to delete product with ID: ${id}?`)) {
      // console.log(`Delete product with ID: ${id}`);
      // In a real app, you would make an API call to delete the product
      setProducts(products.filter((product) => product._id !== id));
      alert(`Product ${id} deleted (mock action).`);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.header}>Product Listing (Admin)</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.header}>Product Listing (Admin)</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Product Listing (Admin)</h1>
      <button onClick={fetchProducts}>Refresh</button>
      <ProductTable products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
    </div>
  );
};

export default ProductListPage;