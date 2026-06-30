import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logofinal.png";
import { useLocation } from "react-router-dom";

export default function Login() {
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/";
  console.log("Redirect Path:", import.meta.env.VITE_SERVER_BASE_URL); // Debugging line
  const handleLogin = () => {
    // send redirect path to backend
    window.location.href = `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/google?redirect=${redirectPath}`;
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="row bg-white rounded shadow-lg overflow-hidden"
        style={{ maxWidth: "1000px", minHeight: "500px" }}
      >
        {/* Login Section (Always First) */}
        <div className="col-md-6 p-4 d-flex flex-column justify-content-center align-items-center gap-3">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Welcome!</h2>
            <p className="text-muted">Sign in to your account to continue.</p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleLogin}
            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-2"
            style={{ maxWidth: "300px" }}
          >
            <FcGoogle size={28} /> Login with Google
          </button>
        </div>

        {/* Branding Section (Always Second) */}
        <div className="col-md-6 p-4 border-start d-flex flex-column justify-content-center align-items-center text-center">
          <h2 className="display-5 fw-bold text-dark mb-3">CHLOE'S VENTURE</h2>
          <p className="fs-5 text-secondary mb-4">
            Where every identity is seen.
            <br />
            Where elegance feels like home.
          </p>
          <img
            src={logo}
            alt="Brand Aesthetics"
            className="img-fluid rounded"
            style={{ maxWidth: "250px" }}
          />
        </div>
      </div>
    </div>
  );
}
