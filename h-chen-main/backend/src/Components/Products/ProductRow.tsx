// src/components/ProductRow.tsx

import React from "react";
import styles from "./ProductList.module.css";
import { Product } from "@/Types/product";
import Link from "next/link";
import { toast } from "react-toastify";
// import { useRouter } from "next/router";

interface ProductRowProps {
  product: Product,
  
}
type Tresponse = {
  status: number,
  message: string,
}

const ProductRow: React.FC<ProductRowProps> = ({ product }) => {
  const formattedBestBefore = new Date(product.bestBefore).toLocaleDateString();
  // const router = useRouter();

  // const onDelete = (productId: string) => {
  //   if (confirm("Are you sure you want to delete this product?")) {
  //     router.push(`/products/delete/${productId}`);
  //   }
  // };

  // const onEdit = (productId: string) => {
  //   router.push(`/products/digital/digital-edit-product/${productId}`);
  // };

  

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const response: Tresponse = await fetch(`/api/products/delete/${product._id}`, {
        method: "DELETE",

      })
      .then((response) => response.json())

      // if(response.status === 200){
        toast.success(response.message)
      // }
    }
  }

  return (
    <tr>
      <td>
        <img
          src={product.images[0] || "https://via.placeholder.com/50"}
          alt={product.title}
          className={styles.productImage}
        />
        {product.title}
      </td>
      {/* <td>{product.sku}</td> */}
      {/* <td>{product.brand}</td> */}
      <td>{product.category}</td>{" "}
      {/* In a real app, you'd fetch category name */}
      <td className={styles.priceDisplay}>
          Rs. {product.price.toFixed(2)}
      </td>
      <td>
        {product.stock == 0 ? <span>Out Of Stock</span> : product.stock} 
      </td>
      {/* <td>{formattedBestBefore}</td> */}
      {/* <td>{product.new && <span className={styles.newBadge}>New</span>}</td> */}
      <td className={styles.actions}>
        <Link
          href={`/en/products/digital/digital-edit-product/${product._id}`}
          className={`${styles.actionButton} ${styles.editButton}`}
        >
          Edit
        </Link>
        <button
          onClick={()=>handleDelete(product._id)}
          className={`${styles.actionButton} ${styles.deleteButton}`}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
