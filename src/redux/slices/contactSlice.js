import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const submitContact = createAsyncThunk(
  'contacts/submitContact',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await api.post('/contacts', contactData);
      return response.data.data.contact;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit contact';
      return rejectWithValue(message);
    }
  }
);

export const getContacts = createAsyncThunk(
  'contacts/getContacts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/contacts?${queryParams}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch contacts';
      return rejectWithValue(message);
    }
  }
);

export const updateContactStatus = createAsyncThunk(
  'contacts/updateContactStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contacts/${id}/status`, { status });
      return response.data.data.contact;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update contact status';
      return rejectWithValue(message);
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contacts/${id}`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete contact';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  contacts: [],
  currentContact: null,
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
    endDate: '',
    search: ''
  }
};

// Contact slice
const contactSlice = createSlice({
  name: 'contacts',
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
    clearCurrentContact: (state) => {
      state.currentContact = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Contact
      .addCase(submitContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitContact.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Contacts
      .addCase(getContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Contact Status
      .addCase(updateContactStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contacts.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateContactStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Contact
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(c => c._id !== action.payload);
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  clearCurrentContact
} = contactSlice.actions;

export default contactSlice.reducer;

// Selectors
export const selectContacts = (state) => state.contacts.contacts;
export const selectCurrentContact = (state) => state.contacts.currentContact;
export const selectContactsPagination = (state) => state.contacts.pagination;
export const selectContactsLoading = (state) => state.contacts.loading;
export const selectContactsError = (state) => state.contacts.error;
export const selectContactsFilters = (state) => state.contacts.filters;