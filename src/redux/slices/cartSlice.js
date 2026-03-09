import { createSlice } from '@reduxjs/toolkit';

// Helper functions
const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  const total = subtotal + tax;

  return { subtotal, tax, total };
};

// Initial state
const initialState = {
  items: [],
  totals: {
    subtotal: 0,
    tax: 0,
    total: 0
  },
  serviceAddress: null,
  scheduledDate: null,
  scheduledTimeSlot: null,
  specialInstructions: '',
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { service, quantity = 1, addOns = [] } = action.payload;

      // Null check for service._id
      if (!service._id) {
        console.error('Service ID is required to add item to cart');
        return;
      }

      // Calculate base price
      let basePrice = service.basePrice;

      // Calculate add-on total
      const addOnTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);

      // Calculate item total
      const totalPrice = (basePrice + addOnTotal) * quantity;

      const cartItem = {
        id: `${service._id}_${Date.now()}`, // Unique ID for cart item
        serviceId: service._id,
        serviceName: service.serviceName,
        serviceSlug: service.slug,
        quantity,
        basePrice,
        addOns,
        totalPrice,
        service
      };

      state.items.push(cartItem);
      state.totals = calculateTotals(state.items);
    },

    updateCartItem: (state, action) => {
      const { id, quantity, addOns } = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item) {
        item.quantity = quantity || item.quantity;
        item.addOns = addOns || item.addOns;

        // Recalculate add-on total
        const addOnTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);

        // Recalculate item total
        item.totalPrice = (item.basePrice + addOnTotal) * item.quantity;

        state.totals = calculateTotals(state.items);
      }
    },

    removeFromCart: (state, action) => {
      const { id } = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      state.totals = calculateTotals(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.totals = calculateTotals([]);
      state.serviceAddress = null;
      state.scheduledDate = null;
      state.scheduledTimeSlot = null;
      state.specialInstructions = '';
    },

    setServiceAddress: (state, action) => {
      state.serviceAddress = action.payload;
    },

    setSchedule: (state, action) => {
      const { date, timeSlot } = action.payload;
      state.scheduledDate = date;
      state.scheduledTimeSlot = timeSlot;
    },

    setSpecialInstructions: (state, action) => {
      state.specialInstructions = action.payload;
    },

    applyCoupon: (state, action) => {
      // This would be handled by the backend
      // For now, just store the coupon code
      state.couponCode = action.payload;
    },

    removeCoupon: (state) => {
      state.couponCode = null;
      // Recalculate totals if needed
    },
  },
});

export const {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  setServiceAddress,
  setSchedule,
  setSpecialInstructions,
  applyCoupon,
  removeCoupon
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotals = (state) => state.cart.totals;
export const selectCartItemCount = (state) => state.cart.items.length;
export const selectServiceAddress = (state) => state.cart.serviceAddress;
export const selectSchedule = (state) => ({
  date: state.cart.scheduledDate,
  timeSlot: state.cart.scheduledTimeSlot
});
export const selectSpecialInstructions = (state) => state.cart.specialInstructions;
export const selectCouponCode = (state) => state.cart.couponCode;
export const selectIsCartValid = (state) => {
  const cart = state.cart;
  return cart.items.length > 0 &&
         cart.serviceAddress &&
         cart.scheduledDate &&
         cart.scheduledTimeSlot;
};