import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { getPosts } from "../../../services/sanityServices"; // adjust path
import "../../../styling/BlogSection.css";

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const BlogSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once: true });

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setBlogs(response.slice(0, 3)); // only show 4 blogs
      } catch (err) {
        console.error("Failed to fetch blog posts", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <motion.div
      className="container my-5"
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.h1
        className="text-center mb-5 fw-light"
        variants={fadeInVariants}
      >
        Read our articles
      </motion.h1>

      <motion.div className="row g-4" variants={containerVariants}>
        {blogs.map((blog, index) => (
          <motion.div
            className={index === 0 ? "col-md-6" : "col-md-3"}
            key={index}
            variants={fadeInVariants}
          >
            <Link
              to={`/blog/${blog?.slug?.current}`}
              className="text-decoration-none text-dark"
            >
              <div
                className={`article-wrapper zoom-hover ${
                  index === 0 ? "with-overlay" : ""
                }`}
              >
                <img
                  src={blog?.coverImage?.asset?.url}
                  alt={blog?.title}
                  className="img-fluid"
                />

                <div
                  className={`article-content ${
                    index === 0 ? "overlay-text" : ""
                  }`}
                >
                  <p className="article-category mb-1">{blog?.tag}</p>
                  <h5 className="article-title mb-2">{blog?.title}</h5>
                  <p className="article-date">
                    {new Date(blog?.date).toDateString()}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center mt-4"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <Link to="/blog" className="btn btn-dark mt-2">
          Read More
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default BlogSection;
