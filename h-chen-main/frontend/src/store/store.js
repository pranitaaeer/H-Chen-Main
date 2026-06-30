import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import cartSlice from "./cartSlice.js";
import addressSlice from "./addressSlice.js";
import orderSlice from "./orderSlice.js";
import wishlistSlice from "./wishlistSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    address: addressSlice,
    order: orderSlice,
    wishlist: wishlistSlice,
  },
});

export default store;
