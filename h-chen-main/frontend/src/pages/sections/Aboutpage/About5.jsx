import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container, Row, Col, Image } from "react-bootstrap";
import "../../../styling/About5.css";
import chloeImage from "../../../assets/images/cvabout.jpg";

function About5() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });

  return (
    <section ref={sectionRef} id="about5-section" className="about5-section">
      <Container>
        <Row className="align-items-center" style={{ gap: "100px" }}>
          {/* Image Section */}
          <Col lg={4} className="text-center">
            <motion.div
              className="about5-image-wrapper"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Image src={chloeImage} fluid className="about5-image" />
            </motion.div>
          </Col>

          {/* Text Section */}
          <Col lg={7} className="text-lg-start text-center">
            <motion.h2
              className="about5-title"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
            >
              Why Chloe ?
            </motion.h2>

            <motion.div
              className="about5-content"
              initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 40, filter: "blur(4px)" }
              }
              transition={{ duration: 1, delay: 0.4 }}
            >
              <ul className="about5-list">
                <li>
                  <strong>Exclusivity: </strong> Fabrics and collections are
                  never repeated.
                </li>
                <li>
                  <strong>Customization: </strong> Your garment is your
                  identity, not just another piece in a rack.
                </li>
                <li>
                  <strong>Rarity: </strong> Our limited editions make ownership
                  feel like a privilege.
                </li>
                <li>
                  <strong>Vision Beyond Clothing: </strong> We are not building
                  a label; we are building a luxury house.
                </li>
                <li>
                  <strong>Wealth Mindset: </strong> No sales, no discounts —
                  because luxury never begs.
                </li>
              </ul>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default About5;
