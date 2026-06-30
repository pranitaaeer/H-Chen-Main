import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import emailjs from "emailjs-com";
import hatStore from "../assets/contact.avif";
import "../styling/contact.css";
import { toast } from "react-toastify";

function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.2, once: false });
  const formRef = useRef();

  const fadeSlideUp = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_q5qtve9", // replace with your EmailJS service ID
        "template_3si98eg", // replace with your EmailJS template ID
        formRef.current,
        "j9smbM-3RzacSiu2P" // replace with your EmailJS public key
      )
      .then(
        (result) => {
          toast.success(
            "Message sent successfully! Our team shall connect to you shortly."
          );
          formRef.current.reset();
        },
        (error) => {
          toast.error("Failed to send message, please try again.");
        }
      );
  };

  return (
    <div ref={sectionRef}>
      {/* Contact Hero */}
      <div className="text-white bg-black contact-hero">
        <div className="container">
          <motion.h2
            className="contact-heading"
            variants={fadeSlideUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.8 }}
          >
            GET IN TOUCH
          </motion.h2>

          <motion.div
            className="contact-content"
            variants={fadeSlideUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h5>Visit Our Store Today.</h5>
            <p className="contact-paragraph col-md-7">
              We welcome you to explore our exquisite hat collection in person.
              Our team is here to assist you in finding the perfect headpiece to
              elevate your style.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Form Section */}
      <section id="contact-section" className="text-dark">
        <br />

        <div className="row mb-3">
          <motion.div
            className="col-md-5"
            variants={fadeSlideUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src={hatStore} className="contact-image" alt="Hat Store" />
          </motion.div>

          <motion.div
            className="col-md-4 form"
            variants={fadeSlideUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3>ENTER YOUR DETAILS</h3>
            <br />
            <form ref={formRef} onSubmit={sendEmail}>
              <label>First Name *</label>
              <input
                className="form form-control"
                type="text"
                name="firstName"
                placeholder="Enter your first name."
                required
              />
              <label>Last Name *</label>
              <input
                className="form form-control"
                type="text"
                name="lastName"
                placeholder="Enter your last name."
                required
              />
              <label>Email *</label>
              <input
                className="form form-control"
                type="email"
                name="email"
                placeholder="Enter your email id."
                required
              />
              <label>Message</label>
              <textarea
                name="message"
                className="form form-control"
                placeholder="Enter your query."
              ></textarea>

              <button
                type="submit"
                className="btn btn-outline-dark contact-btn"
              >
                Send
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
