import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAddresses,
  addAddress,
  setSelectedAddress,
} from "../store/addressSlice";
import { fetchCartItems, clearCart } from "../store/cartSlice";
import { createOrder } from "../store/orderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { applyCouponCode } from "../services/couponService"; // 👈 import

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    addresses,
    selectedAddress,
    loading: addressLoading,
  } = useSelector((state) => state.address);

  const {
    items,
    totalPrice,
    loading: cartLoading,
  } = useSelector((state) => state.cart);

  const { userData } = useSelector((state) => state.auth);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    alternatePhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "Home",
    isDefault: false,
  });

  const [showAddressForm, setShowAddressForm] = useState(false);

  // 👇 Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(totalPrice);

  useEffect(() => {
    dispatch(getAllAddresses());
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    // recalc final total whenever totalPrice or discount changes
    setFinalTotal(totalPrice - discount);
  }, [totalPrice, discount]);

  const handleAddressSelect = (addr) => {
    dispatch(setSelectedAddress(addr));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    dispatch(addAddress(newAddress)).then((res) => {
      if (!res.error) {
        setShowAddressForm(false);
        setNewAddress({
          fullName: "",
          phone: "",
          alternatePhone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
          addressType: "Home",
          isDefault: false,
        });
        dispatch(getAllAddresses());
      }
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const response = await applyCouponCode({
        code: couponCode,
        userId: userData?._id,
      });

      if (response && response.success) {
        toast.success(`Coupon applied! You saved ${response.discount}% 🎉`);
        const discountAmount = (totalPrice * response.discount) / 100;
        setDiscount(discountAmount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select an address before placing the order");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderDetails = {
      address: selectedAddress._id,
      items: items.map((item) => ({
        product: item.product._id,
        title: item.product.title,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      })),
      billingMethod: "cod",
      totalPrice: finalTotal, // 👈 after discount
    };

    dispatch(createOrder(orderDetails)).then((res) => {
      if (!res.error) {
        dispatch(clearCart());
        navigate("/user/order");
      }
    });
  };

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4">Checkout</h2>
      <div className="row">
        {/* ---------------- Address Section ---------------- */}
        <div className="col-md-8 mb-4">
          <h4 className="mb-3">Select Delivery Address</h4>
          {addressLoading ? (
            <p>Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <p>No addresses found. Please add one.</p>
          ) : (
            <div className="mb-3">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`card mb-2 ${
                    selectedAddress?._id === addr._id
                      ? "border-success"
                      : "border-secondary"
                  }`}
                >
                  <div className="card-body d-flex align-items-start">
                    <input
                      type="radio"
                      className="form-check-input me-3 mt-1"
                      name="selectedAddress"
                      checked={selectedAddress?._id === addr._id}
                      onChange={() => handleAddressSelect(addr)}
                    />
                    <div>
                      <h6 className="mb-1">{addr.fullName}</h6>
                      <p className="mb-1 text-muted small">{addr.phone}</p>
                      <p className="mb-0 small">
                        {addr.addressLine1}, {addr.city}, {addr.state} -{" "}
                        {addr.postalCode}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="btn btn-link p-0"
          >
            {showAddressForm ? "Cancel" : "+ Add New Address"}
          </button>

          {showAddressForm && (
            <form
              onSubmit={handleAddressSubmit}
              className="mt-3 border rounded p-3 bg-light"
            >
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newAddress.fullName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, fullName: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Alternate Phone"
                  value={newAddress.alternatePhone}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      alternatePhone: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={newAddress.addressLine1}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      addressLine1: e.target.value,
                    })
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Address Line 2"
                  value={newAddress.addressLine2}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      addressLine2: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      postalCode: e.target.value,
                    })
                  }
                  required
                  className="form-control"
                />
              </div>

              <button type="submit" className="btn btn-dark">
                Save Address
              </button>
            </form>
          )}
        </div>

        {/* ---------------- Order Summary ---------------- */}
        <div className="col-md-4 mb-4">
          <h4 className="mb-3">Order Summary</h4>
          {cartLoading ? (
            <p>Loading cart...</p>
          ) : items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="card p-3 shadow-sm">
              {items.map((item) => (
                <div
                  key={`${item.product._id}-${item.color}-${item.size}`}
                  className="d-flex justify-content-between border-bottom pb-2 mb-2"
                >
                  <span>
                    {item.product.title} ({item.size}/{item.color}) ×{" "}
                    {item.quantity}
                  </span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}

              {/* Coupon Input */}
              {/* <div className="d-flex mb-3">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              </div>

              Discount & Final Price
              {discount > 0 && (
                <div className="d-flex justify-content-between text-success mb-2">
                  <span>Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )} */}
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={items.length === 0 || !selectedAddress}
                className="btn btn-outline-dark w-100"
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
