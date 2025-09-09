// src/store/slices/catalogSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "catalog/fetchProducts",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Optional: Check if user is authenticated for personalized catalog
      // This is for public products, so no strict auth required
      
      const response = await fetch('/api/products.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error fetching products from API:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    // Your standard reducers can go here if you have any.
  },
  // 'extraReducers' handles actions defined outside the slice, like our thunk.
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // The value from rejectWithValue
      });
  },
});

export default catalogSlice.reducer;
