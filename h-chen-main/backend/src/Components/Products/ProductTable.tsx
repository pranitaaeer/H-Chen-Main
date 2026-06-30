// src/components/ProductTable.tsx

import React from 'react';
import styles from './ProductList.module.css';
import { Product } from '@/Types/product';
import ProductRow from './ProductRow';

interface ProductTableProps {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>Product Name</th>
            {/* <th>SKU</th>
            <th>Brand</th> */}
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            {/* <th>Best Before</th> */}
            {/* <th>New</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductRow key={product._id} product={product}  />
            ))
          ) : (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;