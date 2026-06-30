import { Schema, model, models } from "mongoose";


const WishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "User ID is required for the wishlist."],
      unique: true, 
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },
  },
  {
    timestamps: true, 
  }
);

// Create the Wishlist model or use the existing one if it's already defined
const Wishlist = models.Wishlist || model("Wishlist", WishlistSchema);

export default Wishlist;
