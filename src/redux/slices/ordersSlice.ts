// src/redux/slices/ordersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrdersState {
  totalOrders: number;
}

const initialState: OrdersState = {
  totalOrders: 0,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setTotalOrders: (state, action: PayloadAction<number>) => {
      state.totalOrders = action.payload;
    },
    resetOrders: (state) => {
      state.totalOrders = 0;
    },
  },
});

export const { setTotalOrders, resetOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
