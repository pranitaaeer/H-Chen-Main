import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styling/ComingSoon.css";

const ComingSoon = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  // Function to handle EmailJS submission
  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_nltfe9r", // 🔹 Replace with your EmailJS Service ID
        "template_6498e3p", // 🔹 Replace with your EmailJS Template ID
        formRef.current,
        "TAd-nVfSgtOLniW73" // 🔹 Replace with your EmailJS Public Key
      )
      .then(
        (result) => {
          toast.success("🎉 You’ve been added to the Chloe’s AI waitlist!", {
            position: "top-center",
          });
          e.target.reset();
          setLoading(false);
        },
        (error) => {
          toast.error("Something went wrong. Please try again later.", {
            position: "top-center",
          });
          setLoading(false);
        }
      );
  };

  return (
    <div className="comingsoon-wrapper text-center">
      <div className="circle-wrapper">
        {/* First pulse ring */}
        <motion.div
          className="outer-ring"
          animate={{ scale: [0.5, 1.5], opacity: [0.8, 0.3, 0] }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0.1,
          }}
        />

        {/* Second delayed pulse ring */}
        <motion.div
          className="outer-ring"
          animate={{ scale: [0.5, 1.5], opacity: [0.8, 0.3, 0] }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0.1,
            delay: 1,
          }}
        />

        {/* Inner solid circle */}
        <div className="inner-circle"></div>
      </div>

      {/* Text BELOW animation */}
      <h2 className="circle-text">Chloe's AI</h2>
      <h4 className="mt-2 container">
        We’re building something intelligent and elegant for your wardrobe.
      </h4>
      <h5>Stay Tuned for the Launch!</h5>

      {/* Email form */}
      <form ref={formRef} onSubmit={sendEmail} className="notify-form mt-4 ">
        <input
          type="email"
          name="user_email"
          placeholder="Enter your email"
          required
          className="p-1 fs-5 me-2 emailinput"
        />
        <button
          type="submit"
          className="btn btn-dark btn-md"
          disabled={loading}
        >
          {loading ? "Joining..." : "Notify Me"}
        </button>
      </form>
    </div>
  );
};

export default ComingSoon;
