import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ to read /shop/:category
import FilterSidebar from "../components/FilterSidebar";
import ProductList from "../components/ProductList";
import { getProducts } from "../services/productService";

function AllProducts() {
  const { category } = useParams(); // ✅ read category from URL if present

  const [filters, setFilters] = useState({
    category: [],
    color: [],
    price: { min: 100, max: 5000 },
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchProducts = async () => {
    const res = await getProducts({});
    // console.log("Products:", res);
    if (res) setProducts(res);
    setLoadingProducts(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Update only category when route changes, keep colors/price intact
  useEffect(() => {
    if (category) {
      setFilters((prev) => ({
        ...prev,
        category: [category.toLowerCase()],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        category: [],
      }));
    }
  }, [category]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prev) => {
      if (type === "checkbox") {
        // Toggle for array filters like color or category
        const currentValues = prev[name] || [];
        return {
          ...prev,
          [name]: checked
            ? [...currentValues, value] // add if checked
            : currentValues.filter((v) => v !== value), // remove if unchecked
        };
      }

      // For non-checkbox (price sliders etc.)
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      category: category ? [category.toLowerCase()] : [],
      color: [],
      price: { min: 100, max: 5000 },
    });
  };

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
        <div className="col-md-9 mx-0">
          <h2 className="mb-2 text-capitalize">
            {category ? category : "All Products"}
          </h2>
          {/* <p className="text-muted mb-4 col-md-6">tagline from backend</p> */}
          <div className="mb-2 fw-bold">{filteredProducts.length} Products</div>
          <ProductList products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}

export default AllProducts;
