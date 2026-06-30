import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import "../../../styling/Section3.css";
import allProducts from "../../ProductsData";
import { Link } from "react-router-dom";
import { getProducts } from "../../../services/productService";

function Section3() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

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

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    const maxStart = allProducts.length - visibleCount;
    setStartIndex((prev) => Math.min(prev + visibleCount, maxStart));
  };

  const visibleProducts = products.length
    ? products.slice(startIndex, startIndex + visibleCount)
    : [];

  // Variants
  const fadeInOutContainer = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
    hidden: { opacity: 0, y: 40 },
  };

  const cardVariant = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
    },
  };

  return (
    <section
      className="container-fluid py-5 hat-gallery-section mb-5"
      ref={sectionRef}
    >
      <motion.div
        className="text-center mb-5"
        variants={cardVariant}
        animate={isInView ? "visible" : "hidden"}
        initial="hidden"
      >
        <h1 className="display-4 gallery-title">CHLOE'S GALLERY</h1>
        <h3 className="gallery-subtitle mt-4">Explore the products</h3>
        <p className="gallery-description px-3 px-md-5 mx-auto">
          Immerse yourself in the artistry of our designs. Each weave tells a
          unique story of creativity and style. Discover the perfect product
          that resonates with your personality and taste.
        </p>
      </motion.div>

      <div className="d-flex align-items-center justify-content-center">
        <button
          className="arrow-btn me-3"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          &lt;
        </button>

        <motion.div
          className="section3-carousel-wrapper"
          variants={fadeInOutContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="section3-carousel-track">
            <AnimatePresence>
              {visibleProducts.length &&
                visibleProducts.map((product) => (
                  <motion.div
                    className="section3-card"
                    key={product._id}
                    variants={cardVariant}
                  >
                    <div className="section3-img-wrapper">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="section3-img"
                      />

                      {/* Quick View Overlay */}
                      <div className="quick-view-overlay">
                        <a href={`${product.category}/${product._id}`}>
                          <button className="quick-view-btn">Quick View</button>
                        </a>
                      </div>
                    </div>

                    <div className="section3-info">
                      <h5 className="product-title">{product.title}</h5>
                      <p className="product-price">₹{product.price}</p>
                      <small className="product-category">
                        <a href={`/shop/${product.category}`}>
                          {product.category}
                        </a>
                      </small>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <button
          className="arrow-btn ms-3"
          onClick={handleNext}
          disabled={startIndex + visibleCount >= allProducts.length}
        >
          &gt;
        </button>
      </div>

      <motion.div
        className="text-center"
        variants={cardVariant}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <a href="/shop" className="btn btn-outline-dark mt-5 gallery-button">
          Show More
        </a>
      </motion.div>
    </section>
  );
}

export default Section3;
