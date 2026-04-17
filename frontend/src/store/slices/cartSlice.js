import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const cartFromStorage = localStorage.getItem('shopelite_cart')
  ? JSON.parse(localStorage.getItem('shopelite_cart'))
  : [];

const saveCart = (items) => {
  localStorage.setItem('shopelite_cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: cartFromStorage,
    shippingAddress: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.product._id === product._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else {
        state.items.push({ product, quantity });
      }
      saveCart(state.items);
      toast.success('Added to cart!');
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.product._id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product._id === productId);
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) state.items = state.items.filter(i => i.product._id !== productId);
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('shopelite_cart');
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setShippingAddress } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((acc, item) => acc + (item.product.discountPrice || item.product.price) * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((acc, item) => acc + item.quantity, 0);

export default cartSlice.reducer;
