import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const addProductToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, color, size },
    { rejectWithValue, getState }
  ) => {
    try {
      const { userData } = getState().auth;
      const response = await api.post("/cart/add-to-cart", {
        user: userData.id,
        product: {
          id: productId,
          quantity: quantity,
          color: color,
          size: size,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding product to cart:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to add item to cart" }
      );
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { userData } = getState().auth;
      const response = await api.get(`/cart?user=${userData.id}`);
      // console.log("cart data", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch cart items or cart is empty",
        }
      );
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue, getState }) => {
    try {
      const { userData } = getState().auth;
      const response = await api.put(`/cart/update-quantity`, {
        user: userData.id,
        product: productId,
        quantity: quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating quantity:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to update quantity" }
      );
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({productId, color, size}, { rejectWithValue, getState }) => {
    try {
      const { userData } = getState().auth;
      const response = await api.delete(
        `/cart/delete-item/${userData.id}/${productId}/${color}/${size}`,
      );
      // console.log("RES DATA: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting cart item:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete cart item" }
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { userData } = getState().auth;
      const response = await api.delete(`/cart/delete-all/${userData.id}`);
      return response.data;
    } catch (error) {
      // console.log("Error clearing Cart!", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to clear cart" }
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    loading: false,
    appliedCoupon: null,
    discount: 0,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalPrice = action.payload.totalPrice.toFixed(2);
    },
    setAppliedCoupon: (state, action) => {
      const coupon = action.payload;
      state.appliedCoupon = coupon;

      const discount = coupon
        ? coupon?.discountType === "percent"
          ? (coupon?.discountValue / 100) * state.totalPrice
          : coupon?.discountValue
        : 0;
      state.discount = discount.toFixed(2);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        const { products } = action.payload;
        state.items = products;
        state.totalQuantity = products.length;
        state.loading = false;
        state.appliedCoupon = null;
        state.discount = 0;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.loading = false;
        console.error("Failed to add product to cart:", action.payload);
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        const { products } = action.payload;

        state.items = products;
        state.totalQuantity = products.length;

        const totalPrice = products.reduce((acc, item) => {
          return acc + item.product.price * item.quantity;
        }, 0);

        state.totalPrice = totalPrice.toFixed(2);
        state.loading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        console.error("Failed to fetch cart items:", action.payload);
      })
      .addCase(updateQuantity.pending, () => {
        // state.loading = true;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { products } = action.payload;

        state.items = products;
        state.totalQuantity = products.length;

        const totalPrice = products.reduce((acc, item) => {
          return acc + item.product.price * item.quantity;
        }, 0);

        state.totalPrice = totalPrice.toFixed(2);
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        console.error("Failed to update quantity:", action.payload);
      })
      .addCase(deleteCartItem.pending, () => {
        // state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        const { products } = action.payload;

        state.items = products;
        state.totalQuantity = products?.length;

        const totalPrice = products?.reduce((acc, item) => {
          return acc + item.product.price * item.quantity;
        }, 0);

        state.totalPrice = totalPrice.toFixed(2);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        console.error("Failed to delete cart item:", action.payload);
      })
      .addCase(clearCart.pending, () => {
        // state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        console.error("Failed to delete cart item:", action.payload);
      });
  },
});

export const { setAppliedCoupon } = cartSlice.actions;
export default cartSlice.reducer;
