import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import FilterSidebar from "../components/FilterSidebar";
import { getProducts } from "../services/productService";
import Loader from "../components/Loader";

function CategoryPage() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [filters, setFilters] = useState({
    category: [],
    color: [],
    price: { min: 100, max: 5000 },
  });

  // Fetch products for the selected category
  const fetchProducts = async () => {
    setLoadingProducts(true);
    const res = await getProducts({ category });
    if (res) setProducts(res);
    setLoadingProducts(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  // ✅ Keep category filter in sync with URL
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: category ? [category.toLowerCase()] : [],
    }));
  }, [category]);

  // ✅ Just accept the value from FilterSidebar
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Reset filters (keep category + match price range)
  const resetFilters = () => {
    setFilters({
      category: category ? [category.toLowerCase()] : [],
      color: [],
      price: { min: 100, max: 5000 },
    });
  };

  // ✅ Filtering logic
  const filteredProducts = products.length
    ? products.filter((product) => {
        const inCategory =
          filters.category.length === 0 ||
          filters.category.includes(product.category?.toLowerCase());

        const inColor =
          filters.color.length === 0 ||
          (Array.isArray(product.colors) &&
            product.colors.some(
              (c) => c && filters.color.includes(c.toLowerCase())
            ));

        const inPriceRange =
          product.price >= filters.price.min &&
          product.price <= filters.price.max;

        return inCategory && inColor && inPriceRange;
      })
    : [];

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2">
          <FilterSidebar
            filters={filters}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
          />
        </div>

        {/* Products */}
        <div className="col-md-9">
          <h2 className="mb-2 text-capitalize">{category}</h2>
          <div className="mb-2 fw-bold">{filteredProducts.length} Products</div>
          {loadingProducts ? (
            <Loader />
          ) : (
            <ProductList products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
