import React from "react";
import "../../../styling/Section6.css";
import herovideo from "../../../assets/herofinal.mp4";

function Section6() {
  return (
    <div className="hero-container">
      <video className="vd" autoPlay muted loop playsInline>
        <source src={herovideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default Section6;
