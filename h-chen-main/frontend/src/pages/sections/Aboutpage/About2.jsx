import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
// import aboutImage2 from "../../../assets/aboutsection2.png";
import aboutImage2 from "../../../assets/images/cvabout.jpg";
import "../../../styling/About2.css";
import herovideo from "../../../assets/herofinal.mp4";

function About2() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });

  return (
    <div className="hero-container">
      <video className="about2vd" autoPlay muted loop playsInline>
        <source src={herovideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default About2;
