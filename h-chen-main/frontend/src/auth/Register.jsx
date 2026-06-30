import React, { useState } from "react";
import { auth } from "../firebase/firebase.js";
import { toast, ToastContainer } from "react-toastify";
import { sendSignInLinkToEmail } from "firebase/auth";

function Register() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      url: import.meta.env.VITE_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, config);
    toast.success(
      `Email is send to ${email} . Click on the link to complete registration.`
    );

    //saving user to local storage
    window.localStorage.setItem("emailForRegistration", email);

    //clearing input
    setEmail("");
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="enter your email"
        autoFocus
        required
      />
      <button type="submit" className="btn btn-outline-dark">
        Submit
      </button>
    </form>
  );
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Register</h1>

          {registerForm()}
        </div>
      </div>
    </div>
  );
}

export default Register;
