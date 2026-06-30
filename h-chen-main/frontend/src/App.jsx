import { useEffect } from "react";
import "./App.css";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./pages/sections/Footer";
import SingleProductsView from "./components/SingleProductsView";
import CategoryPage from "./pages/CategoryPage";
import BlogPage from "./pages/BlogDetails";

import Register from "./auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterComplete from "./auth/RegisterComplete";
import AllProducts from "./pages/AllProducts";
import { useDispatch, useSelector } from "react-redux";
import UserRoute from "./routes/UserRoutes";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import { jwtDecode } from "jwt-decode";
import { loginUser } from "./store/authSlice";
import { fetchCartItems } from "./store/cartSlice";
import { getPosts } from "./services/sanityServices";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import PrivacyPolicy from "./pages/footer/PrivacyPolicy";
import RefundPolicy from "./pages/footer/RefundPolicy";
import TermsandConditions from "./pages/footer/TermsandConditions";
import ShippingPolicy from "./pages/footer/ShippingPolicy";
import ComingSoon from "./pages/ComingSoon";

function App() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && pathname.includes("/login")) {
      navigate("/");
    }
  }, [isAuthenticated, pathname, navigate]);

  useEffect(() => {
    if (token) {
      const user = jwtDecode(token);
      dispatch(loginUser(user));
    }
  }, [token, dispatch]);

  return (
    <div>
      <Nav />

      <ToastContainer />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/shop/:category" element={<CategoryPage />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/blog" element={<Blog />} />
        <Route exact path="/blog/:slug" element={<BlogDetails />} />
        <Route exact path="/:category/:id" element={<SingleProductsView />} />
        <Route
          exact
          path="/singleproductview"
          element={<SingleProductsView />}
        />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/auth/callback" element={<AuthCallback />} />

        <Route exact path="/register" element={<Register />} />
        <Route exact path="/register/complete" element={<RegisterComplete />} />
        <Route exact path="/shop" element={<AllProducts />} />
        <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route exact path="/refund-policy" element={<RefundPolicy />} />
        <Route exact path="/chloes-ai" element={<ComingSoon />} />
        <Route
          exact
          path="/termsandconditions"
          element={<TermsandConditions />}
        />
        <Route exact path="/shipping-policy" element={<ShippingPolicy />} />

        <Route path="/user/*" element={<UserRoute />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
