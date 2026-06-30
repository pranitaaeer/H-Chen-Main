import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../../../styling/About3.css";

function About3() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });

  return (
    <section ref={sectionRef}>
      <div id="about3section">
        <div className="container mt-5">
          <motion.h2
            className="about-title"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            OUR MISSION
          </motion.h2>
        </div>

        <div className="container about3content">
          <div className="row mb-3">
            <motion.div
              className="col-md-5 mt-5"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              Our Goal & Aim
            </motion.div>

            <motion.div
              className="col-lg-7 py-5"
              id="about-right"
              initial={{ opacity: 0, x: 50, filter: "blur(4px)" }}
              animate={
                isInView
                  ? { opacity: 1, x: 0, filter: "blur(0px)" }
                  : { opacity: 0, x: 50, filter: "blur(4px)" }
              }
              transition={{ duration: 0.9 }}
            >
              <p>
                Chloe’s Venture is committed to: <br></br>
                <br></br>
                <ul className="points">
                  <li>
                    Introducing exclusive fabrics, one launch at a time,
                    ensuring every edition is rare.
                  </li>
                  <li>
                    Offering customization so that each garment reflects
                    individuality, not mass trends.
                  </li>
                  <li>
                    Expanding gradually from clothing into accessories,
                    interiors, and lifestyle products, creating an ecosystem of
                    elegance.{" "}
                  </li>
                </ul>{" "}
                <br></br>Standing for rarity, legacy & permanence — not
                overproduction and clearance.
                <br></br>Serving those who invest in timeless elegance, not
                temporary fashion.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About3;
