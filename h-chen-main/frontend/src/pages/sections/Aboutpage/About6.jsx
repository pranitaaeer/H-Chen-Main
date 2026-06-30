import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../../../styling/About6.css";
import about6Image from "../../../assets/images/cvbox2.jpg";

function About6() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });

  return (
    <div className="about6-section" ref={sectionRef}>
      {/* Title & Subtitle */}
      <div className="text-center">
        <motion.h4
          id="about6title"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          BUT WHY TRUST ,<br></br> WHEN WE ARE NEW ?
        </motion.h4>
        <motion.h5
          className="mt-5 about6subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, delay: 0.2 }}
        ></motion.h5>
      </div>

      {/* Section: Identity */}
      <div className="row text-center about6-content">
        <motion.div
          className="col-md-6 px-1 py-2"
          id="about6-right"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.9 }}
        >
          <div className="col-lg-8 fs-5">
            <p>
              Old names once started exactly where we stand today — with vision,
              precision, and commitment. <br></br>We don’t rely on history; We
              rely on uncompromised quality, exclusivity, and discipline.
              <br></br>
              <br></br>Trust us not because we are old, but because we are
              fearless enough to redefine luxury in a new way.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="col-md-6"
          id="about6-left"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.9 }}
        >
          <img src={about6Image} alt="Chloe identity visual" />
        </motion.div>
      </div>

      {/* Section: Tagline */}
      <motion.div
        className="row text-center about6-content"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <h5 className="p-3 border-bottom" style={{ color: "#fff" }}>
          Because every legacy begins with one bold step.
        </h5>
      </motion.div>
    </div>
  );
}

export default About6;
