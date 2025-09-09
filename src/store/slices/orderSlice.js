import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  lastOrderId: null,
};

// Place a new order (mock implementation)
export const placeOrderThunk = createAsyncThunk(
  "orders/placeOrder",
  async ({ uid, orderData }, { rejectWithValue }) => {
    try {
      // Authorization check
      if (!uid) {
        throw new Error('User authentication required');
      }
      
      // Mock order placement
      console.log('Placing order:', orderData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock order ID
      const orderId = 'order_' + Date.now();
      
      // Store in localStorage for demo
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push({ ...orderData, orderId, userId: uid });
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      return orderId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all orders for a user (mock implementation)
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (uid, { rejectWithValue }) => {
    try {
      // Authorization check
      if (!uid) {
        throw new Error('User authentication required');
      }
      
      // Get orders from localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      return orders.filter(order => order.userId === uid);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearLastOrderId(state) {
      state.lastOrderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrderId = action.payload;
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLastOrderId } = orderSlice.actions;
export default orderSlice.reducer;
