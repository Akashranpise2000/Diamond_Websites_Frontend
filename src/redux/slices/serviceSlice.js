import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const getServices = createAsyncThunk(
  'services/getServices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/services?${queryParams}`);
      const data = response.data.data;

      // If no services from API, fall back to mock data
      if (!data.services || data.services.length === 0) {
        // Import mock data dynamically
        const { default: servicesData } = await import('../../data/servicesData');
        const mockServices = servicesData.map(service => ({
          _id: service._id,
          serviceName: service.serviceName,
          slug: service.slug,
          description: service.description,
          shortDescription: service.shortDescription,
          category: service.category,
          pricing: {
            basePrice: service.basePrice
          },
          duration: service.duration,
          image: service.image,
          isActive: service.isActive,
          isFeatured: service.isFeatured
        }));

        return {
          services: mockServices,
          pagination: {
            page: 1,
            limit: mockServices.length,
            total: mockServices.length,
            pages: 1
          }
        };
      }

      return data;
    } catch (error) {
      // On error, also fall back to mock data
      try {
        const { default: servicesData } = await import('../../data/servicesData');
        const mockServices = servicesData.map(service => ({
          _id: service._id,
          serviceName: service.serviceName,
          slug: service.slug,
          description: service.description,
          shortDescription: service.shortDescription,
          category: service.category,
          pricing: {
            basePrice: service.basePrice
          },
          duration: service.duration,
          image: service.image,
          isActive: service.isActive,
          isFeatured: service.isFeatured
        }));

        return {
          services: mockServices,
          pagination: {
            page: 1,
            limit: mockServices.length,
            total: mockServices.length,
            pages: 1
          }
        };
      } catch (mockError) {
        const message = error.response?.data?.message || 'Failed to fetch services';
        return rejectWithValue(message);
      }
    }
  }
);

export const getService = createAsyncThunk(
  'services/getService',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data.data.service;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch service';
      return rejectWithValue(message);
    }
  }
);

export const getServiceBySlug = createAsyncThunk(
  'services/getServiceBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/services/slug/${slug}`);
      return response.data.data.service;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch service';
      return rejectWithValue(message);
    }
  }
);

export const getFeaturedServices = createAsyncThunk(
  'services/getFeaturedServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/services/featured');
      return response.data.data.services;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch featured services';
      return rejectWithValue(message);
    }
  }
);

export const searchServices = createAsyncThunk(
  'services/searchServices',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`/services/search?q=${encodeURIComponent(query)}`);
      return response.data.data.services;
    } catch (error) {
      const message = error.response?.data?.message || 'Search failed';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  services: [],
  featuredServices: [],
  currentService: null,
  searchResults: [],
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  },
  loading: false,
  error: null,
  filters: {
    category: '',
    search: '',
    sort: '-popularity'
  }
};

// Service slice
const serviceSlice = createSlice({
  name: 'services',
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
    clearCurrentService: (state) => {
      state.currentService = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Services
      .addCase(getServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.services;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Single Service
      .addCase(getService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getService.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
        state.error = null;
      })
      .addCase(getService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentService = null;
      })

      // Get Service by Slug
      .addCase(getServiceBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
        state.error = null;
      })
      .addCase(getServiceBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentService = null;
      })

      // Get Featured Services
      .addCase(getFeaturedServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedServices.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredServices = action.payload;
        state.error = null;
      })
      .addCase(getFeaturedServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Services
      .addCase(searchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.searchResults = [];
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  clearCurrentService,
  clearSearchResults
} = serviceSlice.actions;

export default serviceSlice.reducer;

// Selectors
export const selectServices = (state) => state.services.services;
export const selectCurrentService = (state) => state.services.currentService;
export const selectFeaturedServices = (state) => state.services.featuredServices;
export const selectSearchResults = (state) => state.services.searchResults;
export const selectServicesPagination = (state) => state.services.pagination;
export const selectServicesLoading = (state) => state.services.loading;
export const selectServicesError = (state) => state.services.error;
export const selectServicesFilters = (state) => state.services.filters;