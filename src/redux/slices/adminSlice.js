import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks for admin operations
export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard stats';
      return rejectWithValue(message);
    }
  }
);

export const getAllBookingsAdmin = createAsyncThunk(
  'admin/getAllBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/bookings?${queryParams}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bookings';
      return rejectWithValue(message);
    }
  }
);

export const getBookingByIdAdmin = createAsyncThunk(
  'admin/getBookingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/bookings/${id}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch booking details';
      return rejectWithValue(message);
    }
  }
);

export const updateBookingAdmin = createAsyncThunk(
  'admin/updateBooking',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/bookings/${id}`, data);
      return response.data.data.booking;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update booking';
      return rejectWithValue(message);
    }
  }
);

export const deleteBookingAdmin = createAsyncThunk(
  'admin/deleteBooking',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/bookings/${id}`, { data: { reason } });
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel booking';
      return rejectWithValue(message);
    }
  }
);

export const getAllPaymentsAdmin = createAsyncThunk(
  'admin/getAllPayments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/payments?${queryParams}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch payments';
      return rejectWithValue(message);
    }
  }
);

export const getPaymentByIdAdmin = createAsyncThunk(
  'admin/getPaymentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/payments/${id}`);
      return response.data.data.payment;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch payment details';
      return rejectWithValue(message);
    }
  }
);

export const getPaymentStatsAdmin = createAsyncThunk(
  'admin/getPaymentStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/payments/stats?${queryParams}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch payment statistics';
      return rejectWithValue(message);
    }
  }
);

export const getOrderStatsAdmin = createAsyncThunk(
  'admin/getOrderStats',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/orders/stats?${queryParams}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch order statistics';
      return rejectWithValue(message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/users?${queryParams}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      return rejectWithValue(message);
    }
  }
);

export const getAnalytics = createAsyncThunk(
  'admin/getAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/analytics?${queryParams}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch analytics';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  dashboardStats: {
    totalBookings: 0,
    totalRevenue: 0,
    activeServices: 0,
    totalCustomers: 0,
    monthlyBookings: [],
    revenueByService: [],
    recentActivity: []
  },
  bookings: {
    list: [],
    current: null,
    pagination: { page: 1, limit: 10, total: 0, pages: 0 }
  },
  payments: {
    list: [],
    current: null,
    stats: null,
    pagination: { page: 1, limit: 10, total: 0, pages: 0 }
  },
  orders: {
    stats: null
  },
  users: [],
  analytics: {
    bookingTrends: [],
    revenueTrends: [],
    servicePopularity: [],
    customerGrowth: []
  },
  pagination: {
    users: { page: 1, limit: 10, total: 0, pages: 0 }
  },
  loading: false,
  error: null,
  filters: {
    bookings: { status: '', search: '', startDate: '', endDate: '', sort: '-createdAt' },
    payments: { status: '', search: '', startDate: '', endDate: '', sort: '-createdAt' },
    users: { role: '', search: '', status: '' }
  }
};

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setBookingFilters: (state, action) => {
      state.filters.bookings = { ...state.filters.bookings, ...action.payload };
    },
    setPaymentFilters: (state, action) => {
      state.filters.payments = { ...state.filters.payments, ...action.payload };
    },
    setUserFilters: (state, action) => {
      state.filters.users = { ...state.filters.users, ...action.payload };
    },
    clearBookingFilters: (state) => {
      state.filters.bookings = initialState.filters.bookings;
    },
    clearPaymentFilters: (state) => {
      state.filters.payments = initialState.filters.payments;
    },
    clearUserFilters: (state) => {
      state.filters.users = initialState.filters.users;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
        state.error = null;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Bookings
      .addCase(getAllBookingsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookingsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.list = action.payload.bookings;
        state.bookings.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getAllBookingsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBookingByIdAdmin.fulfilled, (state, action) => {
        state.bookings.current = action.payload.booking;
      })

      .addCase(updateBookingAdmin.fulfilled, (state, action) => {
        const index = state.bookings.list.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings.list[index] = action.payload;
        }
      })

      .addCase(deleteBookingAdmin.fulfilled, (state, action) => {
        state.bookings.list = state.bookings.list.filter(b => b._id !== action.payload);
      })

      // Payments
      .addCase(getAllPaymentsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPaymentsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.list = action.payload.payments;
        state.payments.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getAllPaymentsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPaymentByIdAdmin.fulfilled, (state, action) => {
        state.payments.current = action.payload;
      })

      .addCase(getPaymentStatsAdmin.fulfilled, (state, action) => {
        state.payments.stats = action.payload;
      })

      // Order Stats
      .addCase(getOrderStatsAdmin.fulfilled, (state, action) => {
        state.orders.stats = action.payload;
      })

      // Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination.users = action.payload.pagination;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })

      // Analytics
      .addCase(getAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
        state.error = null;
      })
      .addCase(getAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setBookingFilters,
  setPaymentFilters,
  setUserFilters,
  clearBookingFilters,
  clearPaymentFilters,
  clearUserFilters
} = adminSlice.actions;

export default adminSlice.reducer;

// Selectors
export const selectDashboardStats = (state) => state.admin.dashboardStats;
export const selectBookingsAdmin = (state) => state.admin.bookings.list;
export const selectCurrentBookingAdmin = (state) => state.admin.bookings.current;
export const selectBookingsPaginationAdmin = (state) => state.admin.bookings.pagination;
export const selectPaymentsAdmin = (state) => state.admin.payments.list;
export const selectCurrentPaymentAdmin = (state) => state.admin.payments.current;
export const selectPaymentStatsAdmin = (state) => state.admin.payments.stats;
export const selectPaymentsPaginationAdmin = (state) => state.admin.payments.pagination;
export const selectOrderStatsAdmin = (state) => state.admin.orders.stats;
export const selectUsers = (state) => state.admin.users;
export const selectAnalytics = (state) => state.admin.analytics;
export const selectAdminPagination = (state) => state.admin.pagination;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
export const selectAdminFilters = (state) => state.admin.filters;