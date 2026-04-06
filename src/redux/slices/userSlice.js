import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      return rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return rejectWithValue(message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await api.put('/users/password', passwordData);
      return response.data.message;
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      return rejectWithValue(message);
    }
  }
);

export const addAddress = createAsyncThunk(
  'user/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/addresses', addressData);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add address';
      return rejectWithValue(message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'user/updateAddress',
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/addresses/${id}`, addressData);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update address';
      return rejectWithValue(message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'user/deleteAddress',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/addresses/${id}`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete address';
      return rejectWithValue(message);
    }
  }
);

export const getLoyaltyPoints = createAsyncThunk(
  'user/getLoyaltyPoints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/loyalty-points');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch loyalty points';
      return rejectWithValue(message);
    }
  }
);

export const getNotifications = createAsyncThunk(
  'user/getNotifications',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/users/notifications?${queryParams}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch notifications';
      return rejectWithValue(message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'user/markNotificationRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/notifications/${id}/read`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark notification as read';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  addresses: [],
  loyaltyPoints: 0,
  notifications: [],
  loading: false,
  error: null,
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setDefaultAddress: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.addresses = action.payload.addresses || [];
        state.loyaltyPoints = action.payload.loyaltyPoints || 0;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
        state.error = null;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(addr => addr._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Loyalty Points
      .addCase(getLoyaltyPoints.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLoyaltyPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.loyaltyPoints = action.payload.points || 0;
        state.error = null;
      })
      .addCase(getLoyaltyPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Notifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload || [];
        state.error = null;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark Notification Read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload);
        if (notification) {
          notification.isRead = true;
        }
      });
  },
});

export const { clearError, setDefaultAddress } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserAddresses = (state) => state.user.addresses;
export const selectLoyaltyPoints = (state) => state.user.loyaltyPoints;
export const selectUserNotifications = (state) => state.user.notifications;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;