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
        newItems = [...state.items, { ...product, quantity: 1 }];
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, totalAmount: total };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter(item => item._id !== productId);
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, totalAmount: total };
    });
  },

  clearCart: () => set({ items: [], totalAmount: 0 })
}));
