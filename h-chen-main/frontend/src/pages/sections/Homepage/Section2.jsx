import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import image1 from "../../../assets/images/cvbox.jpg";
import "../../../styling/Section2.css";

function Section2() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <div className="section2 container-fluid py-5" ref={sectionRef}>
      <div className="container">
        <motion.h1
          className="section2-heading text-center mb-5"
          initial={{ opacity: 0, y: -40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          WHY CHLOE?
        </motion.h1>

        <div className="row align-items-center justify-content-center gx-5">
          <motion.div
            className="col-lg-5 col-md-6 mb-4 mb-md-0"
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <img src={image1} alt="Model" className="img-fluid about-image" />
          </motion.div>

          {/* Text */}
          <motion.div
            className="col-lg-6 col-md-6"
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="story-block px-2 px-md-3">
              <h3 className="our-story-title mb-3">Our Story</h3>
              <p className="our-story-content mb-4">
                Chloe's Venture is where craftsmanship meets individuality. Our
                collection blends heritage techniques and contemporary style,
                ensuring every hat is more than just an accessory—it's a
                personal statement. We proudly collaborate with local artisans
                and global creators to bring thoughtful, elegant pieces to life.
              </p>
              <a href="/about" className="text-decoration-none">
                <button
                  type="button"
                  className="btn btn-outline-dark px-4 py-2 our-story-button "
                >
                  Read More
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Section2;
