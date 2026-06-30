import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../../../styling/Section4.css";

const faqVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Section4 = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });

  return (
    <motion.section
      className="faq-section text-white py-5"
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1 } },
      }}
    >
      <div className="container section4">
        <h1>CHLOE'S FAQ</h1>

        <div className="common-questions">
          <h2 className="faq-title">Common Questions</h2>
          <p className="faq-description ">
            Explore our frequently asked questions to find answers to queries
            about our hats, services, and more. If you have additional
            questions, feel free to reach out to our team for assistance.
          </p>
        </div>

        <br></br>
        <div className="row">
          <div className="col-3"></div>
          <div className="col-md-6">
            {[
              // Use array to allow stagger
              {
                question: "What materials are used in your outfits?",
                answer:
                  "Our outfits are crafted using a variety of premium materials such as wool, straw, and felt. Each material is carefully selected to ensure durability, comfort, and style.",
              },
              {
                question: "Do you offer custom fittings?",
                answer:
                  "Yes, we provide personalized fitting services to ensure you find the perfect dress that complements your style and fits you comfortably. Visit our store for a bespoke fitting experience.",
              },
              {
                question: "What styles of outfits do you specialize in?",
                answer:
                  "Our specialty lies in a wide range of crochet styles including Panama , fedoras, bowlers, and straw . Whether you prefer classic designs or contemporary trends, we have a outfit for every preference.",
              },
            ].map((item, i) => (
              <motion.div
                className="faq-item mb-5"
                key={i}
                custom={i}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={faqVariants}
              >
                <p className="faq-question">{item.question}</p>
                <p className="faq-answer">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Section4;
