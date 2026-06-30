import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlistItems,
  deleteWishlistItem,
} from "../../store/wishlistSlice";
import { addProductToCart, fetchCartItems } from "../../store/cartSlice";
import { Spin, Empty } from "antd";
import { toast } from "react-toastify";

function Wishlist() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  // Local state to track loading for each item
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    dispatch(fetchWishlistItems());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(deleteWishlistItem({ productId }))
      .unwrap()
      .then(() => toast.info("Removed from wishlist"));
  };

  const handleAddToCart = (product) => {
    setAddingToCart((prev) => ({ ...prev, [product._id]: true }));

    dispatch(
      addProductToCart({
        productId: product._id,
        quantity: 1,
        size: product.sizes?.[0] || null,
        color: product.colors?.[0] || null,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Added to cart!");
        dispatch(fetchCartItems());
        dispatch(deleteWishlistItem({ productId: product._id })); // remove from wishlist
      })
      .catch(() => toast.error("Failed to add to cart"))
      .finally(() =>
        setAddingToCart((prev) => ({ ...prev, [product._id]: false }))
      );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-h-[300px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1 className="text-3xl font-serif mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <Empty description="No items in your wishlist" />
      ) : (
        <div className="container">
          <div className="row g-4">
            {items.map((item) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={item._id || item.id}
              >
                <div className="card h-100 shadow-sm border rounded-3">
                  {/* Product Image */}
                  <div
                    className="d-flex justify-content-center align-items-center bg-light"
                    style={{ height: "200px" }}
                  >
                    <img
                      src={item?.images?.[0] || "/placeholder.png"}
                      alt={item?.title}
                      className="img-fluid object-fit-cover h-100"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{item?.title}</h5>
                      <p className="card-text text-muted">₹{item?.price}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex flex-column gap-2 mt-3">
                      <button
                        className="btn btn-dark"
                        onClick={() => handleAddToCart(item)}
                        disabled={addingToCart[item._id]}
                      >
                        {addingToCart[item._id] ? "Adding..." : "Add to Cart"}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemove(item?._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
