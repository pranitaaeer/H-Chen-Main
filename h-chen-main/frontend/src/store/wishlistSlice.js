import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const addProductToWishlist = createAsyncThunk(
  "wishlist/add",
  async ({ productId }, { rejectWithValue, getState }) => {
    try {
      const { userData } = getState().auth;

      const response = await api.post("/wishlist/add-to-wishlist", {
        userId: userData.id,
        productId,
      });

      // toast.success("Added to wishlist");
      // console.log("wishlist res", response.data);
      return response.data;
    } catch (error) {
      // console.log("wishlist error", error);
      return rejectWithValue(error.response?.data || { message: "Failed" });
    }
  }
);

export const fetchWishlistItems = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { userData } = getState().auth;
      const response = await api.get(`/wishlist/${userData.id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch wishlist" }
      );
    }
  }
);

export const deleteWishlistItem = createAsyncThunk(
  "wishlist/delete",
  async ({ productId }, { rejectWithValue, getState }) => {
    try {
      const { userData } = getState().auth;
      const response = await api.put("/wishlist/remove-from-wishlist", {
        userId: userData.id,
        productId,
      });
      // toast.info("Removed from wishlist");
      return response.data;
    } catch (error) {
      // toast.error(
      //   error.response?.data?.message || "Failed to remove from wishlist"
      // );
      return rejectWithValue(error.response?.data || { message: "Failed" });
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add
      .addCase(addProductToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items =
          action.payload?.user?.wishlist_product_details || state.items;
      })
      .addCase(addProductToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch
      .addCase(fetchWishlistItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.user?.wishlist_product_details || [];
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteWishlistItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWishlistItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items =
          action.payload?.user?.wishlist_product_details || [];
      })
      .addCase(deleteWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
