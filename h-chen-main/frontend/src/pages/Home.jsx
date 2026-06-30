import React from "react";
import Section1 from "./sections/Homepage/Section1";
import Section2 from "./sections/Homepage/Section2";
import Section4 from "./sections/Homepage/Section4";
import Section5 from "./sections/Homepage/Section5";
import Section6 from "./sections/Homepage/Section6";
import Section3 from "./sections/Homepage/Section3";
import ReviewSection from "./sections/Homepage/ReviewSection";
import BlogSection from "./sections/Homepage/BlogSection";

function Home() {
  return (
    <div>
      <Section1 />

      <Section2 />
      <hr></hr>
      <Section3 />
      <ReviewSection />
      <Section5 />
      <Section6 />
      <BlogSection />
      <Section4 />
    </div>
  );
}

export default Home;
