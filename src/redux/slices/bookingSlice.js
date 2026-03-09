import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data.data.booking;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create booking';
      return rejectWithValue(message);
    }
  }
);

export const getBookings = createAsyncThunk(
  'bookings/getBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/bookings?${queryParams}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bookings';
      return rejectWithValue(message);
    }
  }
);

export const getBooking = createAsyncThunk(
  'bookings/getBooking',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data.data.booking;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch booking';
      return rejectWithValue(message);
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${id}`, data);
      return response.data.data.booking;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update booking';
      return rejectWithValue(message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/bookings/${id}`, {
        data: { reason }
      });
      return { id, reason };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel booking';
      return rejectWithValue(message);
    }
  }
);

export const getUpcomingBookings = createAsyncThunk(
  'bookings/getUpcomingBookings',
  async (hours = 24, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/upcoming?hours=${hours}`);
      return response.data.data.bookings;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch upcoming bookings';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  bookings: [],
  currentBooking: null,
  upcomingBookings: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  loading: false,
  error: null,
  filters: {
    status: '',
    startDate: '',
    endDate: ''
  }
};

// Booking slice
const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const booking = state.bookings.find(b => b._id === id || b.id === id);
      if (booking) {
        booking.status = status;
      }
      if (state.currentBooking && (state.currentBooking._id === id || state.currentBooking.id === id)) {
        state.currentBooking.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Bookings
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Single Booking
      .addCase(getBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(getBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentBooking = null;
      })

      // Update Booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const booking = state.bookings.find(b => b._id === action.payload.id);
        if (booking) {
          booking.status = 'cancelled';
        }
        if (state.currentBooking && state.currentBooking._id === action.payload.id) {
          state.currentBooking.status = 'cancelled';
        }
        state.error = null;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Upcoming Bookings
      .addCase(getUpcomingBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUpcomingBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingBookings = action.payload;
        state.error = null;
      })
      .addCase(getUpcomingBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  clearCurrentBooking,
  updateBookingStatus
} = bookingSlice.actions;

export default bookingSlice.reducer;

// Selectors
export const selectBookings = (state) => state.bookings.bookings;
export const selectCurrentBooking = (state) => state.bookings.currentBooking;
export const selectUpcomingBookings = (state) => state.bookings.upcomingBookings;
export const selectBookingsPagination = (state) => state.bookings.pagination;
export const selectBookingsLoading = (state) => state.bookings.loading;
export const selectBookingsError = (state) => state.bookings.error;
export const selectBookingsFilters = (state) => state.bookings.filters;