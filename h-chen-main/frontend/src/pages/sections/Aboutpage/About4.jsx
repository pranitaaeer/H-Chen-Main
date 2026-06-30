import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../../../styling/About4.css";

const About4 = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });

  return (
    <div className="about4-wrapper container bg-white py-5" ref={sectionRef}>
      <motion.div
        className="container team-section text-center"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }
        }
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className="team-heading mb-3">FOUNDER'S NOTE</h1>
        <hr className="divider" />

        <div className="col-md-10 mx-auto px-3 px-md-5">
          <p className="founder-paragraph">
            Chloe is for the confident and the curious,
            <br />
            The expressive and the evolving.
            <br />
            <br />
            It’s for you — <br />
            no matter who you love,
            <br /> where you come from,
            <br />
            or how you define yourself.
          </p>

          <p className="founder-paragraph italic mt-4">
            This isn’t fashion.
            <br />
            This is a <em>movement of emotion, elegance, and empathy</em>.
          </p>

          <h5 className="founder-signature mt-4">
            Chloe — Where every identity is seen.
            <br />
            Where elegance feels like home.
          </h5>
        </div>
      </motion.div>
    </div>
  );
};

export default About4;
