import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice.js';
import cartReducer from './api/cartSlice.js';
import authReducer from './api/authSlice.js';


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});