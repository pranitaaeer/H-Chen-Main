import react from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Wishlist from "../pages/user/Wishlist";
import Cart from "../pages/user/Cart";
import CheckoutPage from "../pages/Checkout";
import Order from "../pages/user/Order";

const UserRoute = () => {
  const { userData } = useSelector((state) => state.auth); //fore checking user
  // console.log("USER..", userData);

  return userData ? (
    <div>
      <Routes>
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route exact path="order" element={<Order />} />
      </Routes>
    </div>
  ) : null;
};

export default UserRoute;
