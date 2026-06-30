import { Schema, model, models } from "mongoose";

const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product", 
      required: [true, "Product ID is required."],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required."],
      default: 1,
      min: [1, "Quantity must be at least 1."], 
    },
    color: {
      type: String,
      required: [true, "Color is required for the product."],
      trim: true, 
    },
    size: {
      type: String,
      required: [true, "Size is required for the product."],
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "User ID is required for the cart."],
      unique: true, 
    },
    products: {
      type: [CartItemSchema], 
      default: [],
    },
  },
  {
    timestamps: true, 
  }
);

// Create the Cart model or use the existing one if it's already defined
const Cart = models.Cart || model("Cart", CartSchema);

export default Cart;
