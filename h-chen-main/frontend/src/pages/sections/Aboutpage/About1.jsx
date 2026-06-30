import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../../../styling/About1.css";
import aboutImage from "../../../assets/images/cvbox.jpg";

function About1() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });

  return (
    <div className="about-section" ref={sectionRef}>
      {/* Title & Subtitle */}
      <div className="text-center pt-5">
        <motion.h4
          id="abouttitle"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          WHY CHOOSE US?
        </motion.h4>
        <motion.h5
          className="mt-5 aboutsubtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Chloe is more than just a name. It’s a <em>feeling</em>, a{" "}
          <strong>statement</strong>, and <em>a soft rebellion</em> in a world
          that rushes past emotions.
        </motion.h5>
      </div>

      {/* Section: Identity */}
      <div className="row text-center about-content">
        <motion.div
          className="col-md-6 px-5 py-5"
          id="about-right"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.9 }}
        >
          <div className="col-lg-8">
            <h5 className="pb-3 fw-bold">Our Vision </h5>
            <p>
              To establish Chloe’s Venture as a house of rarity and refinement,
              where fashion is not consumed but curated. We envision a world
              where luxury comes fabric by fabric, customized with precision,
              never repeated, and eventually expands into a complete lifestyle
              empire.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="col-md-6"
          id="about-left"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.9 }}
        >
          <img src={aboutImage} alt="Chloe identity visual" />
        </motion.div>
      </div>

      {/* Section: Tagline */}
      <motion.div
        className="row text-center about-content"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <h5 className="p-3 border-bottom" style={{ color: "#fff" }}>
          Chloe — Where every identity is seen. Where elegance feels like home.
        </h5>
      </motion.div>
    </div>
  );
}

export default About1;
