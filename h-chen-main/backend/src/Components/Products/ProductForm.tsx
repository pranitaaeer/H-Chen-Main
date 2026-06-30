// src/components/ProductForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import styles from "./ProductForm.module.css";
import { fetchCategories } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Assuming your Category interface is defined here or imported
interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface ProductFormData {
  title: string;
  description: string;
  category: string; // This will hold the _id or slug of the selected category
  stock: number;
  price: number;
  // bestBefore: string;
  // discount: number;
  // isNew: boolean;
  colors: string[];
  sizes: string[];
  // tags: string[];
}

export default function ProductForm({ productId }: { productId?: string }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      // brand: "",
      price: 0,
      stock: 0,
      // bestBefore: new Date().toISOString().split("T")[0],
      // discount: 0,
      // isNew: false,
      colors: [],
      sizes: [],
      // tags: [],
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [formMessage, setFormMessage] = useState<string>("");

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  // --- NEW: Category State and Fetching ---
  // const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState([]);
const router = useRouter();
  const categories = [
    "Clo-Aura",
    "Clo-Prime",
    "Clo-Pixie",
    "Clo-Zion",
    "Clo-Bear",
  ];

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        // console.log("fetchedCategories", fetchedCategories);

        // setCategories(fetchedCategories);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProductData = async () => {
      if (productId) {
        try {
          const response = await fetch(`/api/products/get/${productId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch product data");
          }
          const productData = await response.json();
          reset({
            title: productData.title,
            description: productData.description,
            category: productData.category,
            // brand: productData.brand,
            price: productData.price,
            // bestBefore: productData.bestBefore,
            // discount: productData.discount,
            // isNew: productData.isNew,
            stock: productData.stock,
            colors: productData.colors || [],
            sizes: productData.sizes || [],
            // tags: productData.tags || [],
          });
          setImagePreview(productData.images || []);
        } catch (error) {
          console.error("Error fetching product data:", error);
        }
      }
    };

    // fetchCategoriesData();
    fetchProductData();
  }, []);

  useEffect(() => {
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    return () => {
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, 5);
    setFiles(newFiles);
    setFormMessage("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
    },
    multiple: true,
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setFormMessage("Creating product...");
    // console.log("data", data);

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    // Use the selected category (which will be the category's _id or slug)
    formData.append("category", data.category);
    // formData.append("brand", data.brand);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    // formData.append("discount", data.discount.toString());
    // formData.append("isNew", data.isNew.toString());
    // formData.append("bestBefore", data.bestBefore);

    formData.append("colors", data.colors.join(","));
    formData.append("sizes", data.sizes.join(","));
    // formData.append("tags", data.tags.join(","));

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      if (!productId) {
        setFormMessage("Error: Please select at least one image.");
        return;
      }
    }

    try {
      let response;
      if (productId) {
        response = await fetch(`/api/products/update/${productId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch("/api/products/create", {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        const result = await response.json();
        setFormMessage(
          `Product ${
            productId ? "updated" : "created"
          } successfully! Product ID: ${result.product._id}`
        );

        // Use Next.js router for redirect
        
        router.push("/en/products/digital/digital-product-list");
        reset();
        setFiles([]);
        setPreviewUrls([]);
      } else {
        const errorData = await response.json();
        setFormMessage(
          `Failed to create product: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      setFormMessage(`An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <h2 className={styles.formTitle}>Create New Product</h2>

      {/* Title */}
      <div>
        <label htmlFor="title" className={styles.label}>
          Title <span>*</span>
        </label>
        <input
          type="text"
          id="title"
          {...register("title", { required: "Title is required" })}
          className={styles.input}
        />
        {errors.title && (
          <p className={styles.errorText}>{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={styles.label}>
          Description <span>*</span>
        </label>
        <textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          rows={3}
          className={styles.textarea}
        ></textarea>
        {errors.description && (
          <p className={styles.errorText}>{errors.description.message}</p>
        )}
      </div>

      {/* --- NEW: Category Select --- */}
      <div>
        <label htmlFor="category" className={styles.label}>
          Category <span>*</span>
        </label>

        <select
          id="category"
          {...register("category", { required: "Category is required" })}
          className={styles.select}
        >
          <option value="">--Select--</option>
          {categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className={styles.errorText}>{errors.category.message}</p>
        )}
      </div>
      {/* --- END NEW --- */}

      {/* Brand */}
      {/* <div>
        <label htmlFor="brand" className={styles.label}>
          Brand
        </label>
        <input
          type="text"
          id="brand"
          {...register("brand", { required: "Brand is required" })}
          className={styles.input}
        />
        {errors.brand && (
          <p className={styles.errorText}>{errors.brand.message}</p>
        )}
      </div> */}

      {/* Price */}
      <div>
        <label htmlFor="price" className={styles.label}>
          Price <span>*</span>
        </label>
        <input
          type="number"
          id="price"
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
            min: { value: 0, message: "Price must be positive" },
          })}
          placeholder="0"
          className={styles.input}
        />
        {errors.price && (
          <p className={styles.errorText}>{errors.price.message}</p>
        )}
      </div>

      {/* Stock */}
      <div>
        <label htmlFor="stock" className={styles.label}>
          
          Stock <span>*</span>
        </label>
        <input
          type="number"
          id="stock"
          {...register("stock", {
            required: "stock is required",
            valueAsNumber: true,
            min: { value: 0, message: "Stock must be positive" },
          })}
          placeholder="0"
          className={styles.input}
        />
        {errors.stock && (
          <p className={styles.errorText}>{errors.stock.message}</p>
        )}
      </div>

      {/* Best Before (Date) */}
      {/* <div>
        <label htmlFor="bestBefore" className={styles.label}>
          Best Before Date
        </label>
        <input
          type="date"
          id="bestBefore"
          {...register("bestBefore", {
            required: "Best Before date is required",
          })}
          className={styles.input}
        />
        {errors.bestBefore && (
          <p className={styles.errorText}>{errors.bestBefore.message}</p>
        )}
      </div> */}

      {/* Discount */}
      {/* <div>
        <label htmlFor="discount" className={styles.label}>
          Discount (%)
        </label>
        <input
          type="number"
          id="discount"
          {...register("discount", {
            valueAsNumber: true,
            min: { value: 0, message: "Discount cannot be negative" },
            max: { value: 100, message: "Discount cannot exceed 100%" },
          })}
          className={styles.input}
        />
        {errors.discount && (
          <p className={styles.errorText}>{errors.discount.message}</p>
        )}
      </div> */}

      {/* Is New Checkbox */}
      {/* <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="isNew"
          {...register("isNew")}
          className={styles.checkboxInput}
        />
        <label htmlFor="isNew" className={styles.checkboxLabel}>
          Is New Product?
        </label>
      </div> */}

      {/* Colors (using Controller for array input) */}
      <div>
        <label htmlFor="colors" className={styles.label}>
          Colors (comma-separated) <span>*</span>
        </label>
        <Controller
          name="colors"
          control={control}
          rules={{ required: "At least one color is required" }}
          render={({ field }) => (
            <input
              type="text"
              id="colors"
              {...field}
              onChange={(e) =>
                field.onChange(
                  e.target.value.split(",").map((item) => item.trim())
                )
              }
              value={field.value.join(", ")}
              className={styles.input}
            />
          )}
        />
        {errors.colors && (
          <p className={styles.errorText}>{errors.colors.message}</p>
        )}
      </div>

      {/* Sizes (using Controller for array input) */}
      <div>
        <label htmlFor="sizes" className={styles.label}>
          Sizes (comma-separated) <span>*</span>
        </label>
        <Controller
          name="sizes"
          control={control}
          rules={{ required: "At least one size is required" }}
          render={({ field }) => (
            <input
              type="text"
              id="sizes"
              {...field}
              onChange={(e) =>
                field.onChange(
                  e.target.value.split(",").map((item) => item.trim())
                )
              }
              value={field.value.join(", ")}
              className={styles.input}
            />
          )}
        />
        {errors.sizes && (
          <p className={styles.errorText}>{errors.sizes.message}</p>
        )}
      </div>

      {/* Tags (using Controller for array input) */}
      {/* <div>
        <label htmlFor="tags" className={styles.label}>
          Tags (comma-separated)
        </label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              id="tags"
              {...field}
              onChange={(e) =>
                field.onChange(
                  e.target.value.split(",").map((item) => item.trim())
                )
              }
              value={field.value.join(", ")}
              className={styles.input}
            />
          )}
        />
      </div> */}

      {/* Image Upload Section */}
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${
          isDragActive ? styles.dropzoneActive : ""
        }`}
      >
        <input {...getInputProps()} />
        {files.length > 0 ? (
          <p className={styles.dropzoneText}>{files.length} file(s) selected</p>
        ) : (
          <p className={styles.dropzonePlaceholder}>
            Drag 'n' drop some images here, or click to select files (Max 5
            images)
          </p>
        )}
      </div>

      {imagePreview.length > 0 && (
        <div className={styles.imagePreviewsContainer}>
          <h4 className={styles.selectedFilesTitle}>Uploaded Images</h4>
          <div className={styles.imagePreviewsGrid}>
            {imagePreview.map((image, index) => (
              <div key={index} className={styles.imagePreviewItem}>
                <img
                  src={image}
                  alt={`Preview of uploaded image ${index + 1}`}
                  className={styles.imagePreview}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Previews Display */}
      {previewUrls.length > 0 && (
        <div className={styles.imagePreviewsContainer}>
          <h4 className={styles.selectedFilesTitle}>Image Previews:</h4>
          <div className={styles.imagePreviewsGrid}>
            {files.map((file, index) => (
              <div key={file.name + index} className={styles.imagePreviewItem}>
                <img
                  src={previewUrls[index]}
                  alt={`Preview of ${file.name}`}
                  className={styles.imagePreview}
                />
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className={styles.removeImageButton}
                  title="Remove image"
                >
                  &times;
                </button>
                <p className={styles.imageName}>{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting
          ? `${productId ? "Updating" : "Creating"} Product...`
          : `${productId ? "Update" : "Create"} Product`}
      </button>

      {/* Display messages */}
      {formMessage && (
        <p
          className={`${styles.messageContainer} ${
            formMessage.includes("Error")
              ? styles.errorMessage
              : styles.successMessage
          }`}
        >
          {formMessage}
        </p>
      )}
    </form>
  );
}
