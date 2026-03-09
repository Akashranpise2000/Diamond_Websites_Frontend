import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceReducer from './slices/serviceSlice';
import bookingReducer from './slices/bookingSlice';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import adminReducer from './slices/adminSlice';
import contactReducer from './slices/contactSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    bookings: bookingReducer,
    user: userReducer,
    cart: cartReducer,
    admin: adminReducer,
    contacts: contactReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;