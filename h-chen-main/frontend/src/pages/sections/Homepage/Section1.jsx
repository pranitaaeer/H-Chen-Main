import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import "../../../styling/Section1.css";
import modelImage from "../../../assets/images/heromain.avif";

function HeroSection() {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Desktop transforms only
  const textY = useTransform(scrollYProgress, [0, 1], [-300, 200]);
  const leftTextX1 = useTransform(
    scrollYProgress,
    [0, 1],
    isTablet ? [160, -80] : [200, 0]
  );
  const leftTextX2 = useTransform(
    scrollYProgress,
    [0, 1],
    isTablet ? [140, -100] : [180, -80]
  );
  const leftTextX3 = useTransform(
    scrollYProgress,
    [0, 1],
    isTablet ? [140, -100] : [180, -80]
  );
  const rightTextX1 = useTransform(
    scrollYProgress,
    [0, 1],
    isTablet ? [-90, 80] : [-120, 60]
  );
  const rightTextX2 = useTransform(
    scrollYProgress,
    [0, 1],
    isTablet ? [-90, 220] : [-100, 160]
  );
  const rightTextX3 = useTransform(
    scrollYProgress,
    [0, 1],
    isTablet ? [-90, 220] : [-90, 90]
  );

  return (
    <section className="hero-section container-fluid" ref={sectionRef}>
      {isMobile ? (
        // ✅ Mobile: clean stacked layout
        <div className="mobile-hero">
          <div className="mobile-heading">
            <span className="highlight">YOUR</span> STYLE
            <br />
            <span className="highlight">STARTS</span> HERE
          </div>

          <p className="discover-text">
            Discover our new summer collection! <br /> Shop now and refresh
            wardrobe.
          </p>

          <div className="mobile-image-container">
            <img src={modelImage} alt="Model" className="hero-model-img" />
            <div className="sale-badge">
              <div className="inner-circle">
                <span className="discount">30%</span>
                <span className="text">OFF SALE</span>
              </div>
              <svg viewBox="0 0 200 200" className="circular-text">
                <defs>
                  <path
                    id="circlePathMobile"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  />
                </defs>
                <g className="rotate-text">
                  <text>
                    <textPath href="#circlePathMobile" startOffset="0%">
                      * Summer Sale * Summer Sale * Summer Sale * Summer Sale
                    </textPath>
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      ) : (
        // ✅ Desktop / Tablet: animated layout
        <>
          {/* Left Text */}
          <div className="col-md-3 text-end hero-text-left">
            <motion.h1
              className="hero-word left-side-text"
              style={{ y: textY, x: leftTextX1 }}
              initial={{ opacity: 0, x: -100 }}
              animate={isInView ? { opacity: 1, x: leftTextX1.get() } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="vertical-text">
                <div className="asterisk-icon"></div>
                <span className="rotated-text-content">
                  SUMMER IS HERE <br /> GET READY!
                </span>
              </div>
              YOUR
            </motion.h1>

            <motion.h1
              className="hero-word left-side-text starts"
              style={{ y: textY, x: leftTextX2 }}
              initial={{ opacity: 0, x: -100 }}
              animate={isInView ? { opacity: 1, x: leftTextX2.get() } : {}}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              STARTS
            </motion.h1>

            <motion.div
              className="left-side-text discover-text"
              style={{ y: textY, x: leftTextX3 }}
              initial={{ opacity: 0, x: -100 }}
              animate={isInView ? { opacity: 1, x: leftTextX3.get() } : {}}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              Discover our new summer collection! <br /> Shop now and refresh
              wardrobe.
            </motion.div>
          </div>

          {/* Center Image */}
          <motion.div className="col-md-6 text-center mt-5 pt-4 position-relative z-2">
            <img src={modelImage} alt="Model" className="hero-model-img" />
          </motion.div>

          {/* Right Text + Sale Badge */}
          <div className="col-md-4 text-start hero-text-right position-relative z-1">
            <motion.h1
              className="hero-word right-side-text"
              style={{ y: textY, x: rightTextX1 }}
              initial={{ opacity: 0, x: 100 }}
              animate={isInView ? { opacity: 1, x: rightTextX1.get() } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              STYLE
            </motion.h1>

            <motion.h1
              className="hero-word right-side-text"
              style={{ y: textY, x: rightTextX2 }}
              initial={{ opacity: 0, x: 100 }}
              animate={isInView ? { opacity: 1, x: rightTextX2.get() } : {}}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              HERE
            </motion.h1>

            <motion.div
              className="sale-badge"
              style={{ y: textY, x: rightTextX3 }}
              initial={{ opacity: 0, x: 100 }}
              animate={isInView ? { opacity: 1, x: rightTextX3.get() } : {}}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              <div className="inner-circle">
                <span className="discount">30%</span>
                <span className="text">OFF SALE</span>
              </div>
              <svg viewBox="0 0 200 200" className="circular-text">
                <defs>
                  <path
                    id="circlePath"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  />
                </defs>
                <g className="rotate-text">
                  <text>
                    <textPath href="#circlePath" startOffset="0%">
                      * Summer Sale * Summer Sale * Summer Sale * Summer Sale
                    </textPath>
                  </text>
                </g>
              </svg>
            </motion.div>
          </div>
        </>
      )}
    </section>
  );
}

export default HeroSection;
