import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = localStorage.getItem('shopelite_user')
  ? JSON.parse(localStorage.getItem('shopelite_user'))
  : null;

const tokenFromStorage = localStorage.getItem('shopelite_token') || null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage,
    isLoading: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('shopelite_user', JSON.stringify(action.payload.user));
      localStorage.setItem('shopelite_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('shopelite_user');
      localStorage.removeItem('shopelite_token');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('shopelite_user', JSON.stringify(state.user));
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
