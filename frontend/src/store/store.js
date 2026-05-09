import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isLoading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isLoading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  changePassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.changePassword(passwordData);
      set({ isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  clearError: () => set({ error: null })
}));

export const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));

export const useCartStore = create((set) => ({
  items: [],
  totalAmount: 0,

  // Helper function to calculate item total with GST
  getItemTotal: (item) => {
    const baseAmount = item.price * item.quantity;
    const gstRate = item.customGstRate || item.gstRate || 18;
    const taxAmount = (baseAmount * gstRate) / 100;
    return baseAmount + taxAmount;
  },

  // Helper function to calculate total cart amount with GST
  calculateTotalAmount: (items) => {
    return items.reduce((sum, item) => {
      const baseAmount = item.price * item.quantity;
      const gstRate = item.customGstRate || item.gstRate || 18;
      const taxAmount = (baseAmount * gstRate) / 100;
      return sum + baseAmount + taxAmount;
    }, 0);
  },

  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find(item => item._id === product._id);
      let newItems;

      if (existingItem) {
        newItems = state.items.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Ensure HSN and GST are always initialized with proper defaults
        const newItem = { 
          ...product, 
          quantity: 1,
          // Always initialize these fields to ensure they're available
          hsnCode: product.hsnCode || '',
          gstRate: product.gstRate || 18,
          // Custom values will override defaults
          customHsnCode: product.customHsnCode || product.hsnCode || '',
          customGstRate: product.customGstRate || product.gstRate || 18
        };
        newItems = [...state.items, newItem];
      }

      const total = newItems.reduce((sum, item) => {
        const baseAmount = item.price * item.quantity;
        const gstRate = item.customGstRate !== undefined ? item.customGstRate : (item.gstRate || 18);
        const taxAmount = (baseAmount * gstRate) / 100;
        return sum + baseAmount + taxAmount;
      }, 0);
      return { items: newItems, totalAmount: total };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      let newItems;
      if (quantity <= 0) {
        newItems = state.items.filter(item => item._id !== productId);
      } else {
        newItems = state.items.map(item =>
          item._id === productId ? { ...item, quantity } : item
        );
      }

      const total = newItems.reduce((sum, item) => {
        const baseAmount = item.price * item.quantity;
        const gstRate = item.customGstRate || item.gstRate || 18;
        const taxAmount = (baseAmount * gstRate) / 100;
        return sum + baseAmount + taxAmount;
      }, 0);
      return { items: newItems, totalAmount: total };
    });
  },

  updateItemTaxDetails: (productId, hsnCode, gstRate) => {
    set((state) => {
      const newItems = state.items.map(item => {
        if (item._id === productId) {
          const updated = { 
            ...item, 
            customHsnCode: String(hsnCode || '').trim(), 
            customGstRate: Number(gstRate) || 18
          };
          return updated;
        }
        return item;
      });
      
      const total = newItems.reduce((sum, item) => {
        const baseAmount = item.price * item.quantity;
        const gstRateValue = item.customGstRate !== undefined ? item.customGstRate : (item.gstRate || 18);
        const taxAmount = (baseAmount * gstRateValue) / 100;
        return sum + baseAmount + taxAmount;
      }, 0);
      return { items: newItems, totalAmount: total };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter(item => item._id !== productId);
      const total = newItems.reduce((sum, item) => {
        const baseAmount = item.price * item.quantity;
        const gstRate = item.customGstRate !== undefined ? item.customGstRate : (item.gstRate || 18);
        const taxAmount = (baseAmount * gstRate) / 100;
        return sum + baseAmount + taxAmount;
      }, 0);
      return { items: newItems, totalAmount: total };
    });
  },

  clearCart: () => set({ items: [], totalAmount: 0 })
}));
