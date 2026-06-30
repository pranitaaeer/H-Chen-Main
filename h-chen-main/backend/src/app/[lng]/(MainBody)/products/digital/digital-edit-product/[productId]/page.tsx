"use client";
import EditDigitalProduct from "@/Components/Products/Digital/EditDigitalProduct/[sku]";
import ProductForm from "@/Components/Products/ProductForm";
import { useParams } from "next/navigation";

const EditDigitalProductContainer = () => {
  const params = useParams();
  const productId = Array.isArray(params.productId)
    ? params.productId[0]
    : params.productId;
  // console.log("Product Slug:", params);

  // return <EditDigitalProduct editProductSku={editProductsSku} />;
  return <ProductForm productId={productId} />;
};

export default EditDigitalProductContainer;
