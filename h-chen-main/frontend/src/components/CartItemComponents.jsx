import React from "react";
import { useDispatch } from "react-redux";
import { deleteCartItem } from "../store/cartSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";

function CartItemCard({ item }) {
  const dispatch = useDispatch();

  const handleDeleteItem = () => {
    dispatch(
      deleteCartItem({
        productId: item.product._id,
        color: item.color,
        size: item.size,
      })
    )
      .unwrap()
      .then(() => toast.success("Item removed from cart"))
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="d-flex border rounded p-3 shadow-sm align-items-center gap-3">
      {/* Product Image */}
      <div style={{ width: "100px", height: "100px", flexShrink: 0 }}>
        <img
          src={item.product.images[0]}
          alt={item.product.title}
          className="img-fluid rounded"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow-1">
        <Link
          to={`/product/${item.product._id}`}
          className="fw-semibold text-dark text-decoration-none"
        >
          {item.product.title}
        </Link>
        <p className="mb-1 text-muted small">
          Color: {item.color} | Size: {item.size}
        </p>
        <p className="mb-1 fw-bold">₹ {item.product.price}</p>
        <p className="mb-0 small">Quantity: {item.quantity}</p>
      </div>

      {/* Remove Button */}
      <button
        className="btn btn-light border rounded-circle"
        onClick={handleDeleteItem}
      >
        <CloseOutlined />
      </button>
    </div>
  );
}

export default CartItemCard;
