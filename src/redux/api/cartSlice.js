import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { logOut } from "./authSlice";


const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;  
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity = (Number(item.quantity) || 0) + 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && Number(item.quantity) > 1) {
        item.quantity = Number(item.quantity) - 1;
      }
    },
      setCart(state, action) {
      state.items = action.payload.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logOut, (state) => {
        state.items = [];
      })
      .addMatcher(
        apiSlice.endpoints.getCart.matchFulfilled,
        (state, { payload }) => {
          state.items = payload.cart;
        }
      )
      .addMatcher(
        apiSlice.endpoints.addToCart.matchFulfilled,
        (state, { payload }) => {
          state.items = payload.cart;
        }
      );
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, setCart } = cartSlice.actions;
export default cartSlice.reducer;