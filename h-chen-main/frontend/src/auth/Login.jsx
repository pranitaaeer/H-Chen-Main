import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { GoogleCircleFilled, MailOutlined } from "@ant-design/icons";
import { auth, googleAuthProvider } from "../firebase/firebase.js";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getTokenData, setToken } from "../store/authSlice.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { user } = useSelector((state) => ({ ...state }));
  // const location = useLocation();

  // useEffect(() => {
  //   const intended = location.state;
  //   if (intended) return;
  //   if (user && user.token) {
  //     navigate("/");
  //   }
  // }, [user]);

  const handleSubmit = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;
      // console.log("USER", user);
      // Get Firebase token
      const idTokenResult = await user.getIdTokenResult();

      // Save token in Redux
      dispatch(setToken(idTokenResult.token));

      // Optional: immediately fetch user details from backend
      dispatch(getTokenData(idTokenResult.token));

      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const LoginForm = () => (
    <form>
      <input
        type="email"
        placeholder="Enter Your Email"
        className="form-control mb-3"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Enter Password"
        className="form-control mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button
        type="primary"
        onClick={handleSubmit}
        shape="round"
        block
        icon={<MailOutlined />}
      >
        Login With Email/Password
      </Button>

      <Button
        shape="round"
        block
        onClick={googleLogin}
        icon={<GoogleCircleFilled />}
      >
        Login With Google
      </Button>

      <div className="mt-4" style={{ textAlign: "center" }}>
        <a
          href="/forgot/password"
          className="text-danger"
          style={{ display: "block", marginBottom: "10px" }}
        >
          Forgot Password?
        </a>
        <a href="/register" style={{ color: "#a45c40", fontWeight: "bold" }}>
          New User? Register
        </a>
      </div>
    </form>
  );

  return (
    <div className="container-fluid p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <h2>Welcome Back!</h2>
          <p></p>
          {LoginForm()}
        </div>
      </div>
    </div>
  );
}

export default Login;
