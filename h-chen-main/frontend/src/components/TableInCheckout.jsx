// src/pages/Cart.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "../../store/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CartItemCard from "../../components/CartItemCard";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!userData) {
      navigate("/login");
      toast.info("Please sign up or log in to view your cart");
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (userData) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, userData]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!items || items.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">Your cart is empty</h2>
        <button
          className="mt-4 px-4 py-2 bg-black text-white rounded"
          onClick={() => navigate("/shop")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-12 col-lg-8">
          <h4 className="mb-3">Shopping Cart ({items.length} items)</h4>
          <div className="d-flex flex-column gap-3">
            {items.map((item) => (
              <CartItemCard key={item.product._id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-12 col-lg-4">
          <div
            className="p-4 border rounded shadow-sm"
            style={{ position: "sticky", top: "80px" }}
          >
            <h5 className="mb-3">Order Summary</h5>
            {items.map((item, i) => (
              <p key={i} className="mb-2 text-muted small">
                {item.product.title} × {item.quantity} = ₹
                {item.product.price * item.quantity}
              </p>
            ))}
            <hr />
            <h5>
              Total: ₹
              {items.reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
              )}
            </h5>
            <Link to="/user/checkout">
              <button className="btn btn-dark w-100 mt-3 py-2 rounded">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
