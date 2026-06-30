import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.js";
// import { useSelector, useDispatch } from "react-redux";
import {
  signInWithEmailLink,
  updatePassword,
  isSignInWithEmailLink,
} from "firebase/auth";
// import { createOrUpdateUser } from "../../functions/createorupdate";

function RegistrationComplete() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user = useSelector((state) => state.rootReducer.user);

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, []);

  // const roleBasedRedirect = (res) => {
  //   if (res.data.role === "admin") {
  //     navigate("/admin/dashboard");
  //   } else {
  //     navigate("/");
  //   }
  // };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password)
      return toast.error("Email and password are required.");
    if (password.length < 6)
      return toast.error("Password should be at least 6 characters.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match!");

    if (isSignInWithEmailLink(auth, window.location.href)) {
      try {
        const result = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );

        // console.log("RESULT", result);
        if (result.user.emailVerified) {
          window.localStorage.removeItem("emailForRegistration");

          const user = auth.currentUser;
          await updatePassword(user, password);
          const idTokenResult = await user.getIdTokenResult();

          // createOrUpdateUser(idTokenResult.token)
          //   .then((res) => {
          //     dispatch({
          //       type: "LOGGED_IN_USER",
          //       payload: {
          //         name: res.data.name,
          //         email: res.data.email,
          //         token: idTokenResult.token,
          //         _id: res.data._id,
          //         role: res.data.role,
          //       },
          //     });
          //     roleBasedRedirect(res);
          //   })
          //   .catch((err) => console.log(err));
          // console.log("USER", user);
          navigate("/");
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("Invalid sign-in link.");
    }
  }

  const RegisterCompleteForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control"
        value={email}
        readOnly
        disabled
      />
      <input
        type="password"
        className="form-control"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        className="form-control"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="text-end">
        <input type="submit" value="Done" className="btn btn-dark" />
      </div>
    </form>
  );

  return (
    <div className="container-fluid p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h2> Complete Your Registration</h2>
          {RegisterCompleteForm()}
        </div>
      </div>
    </div>
  );
}

export default RegistrationComplete;
