import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  username: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.userId = action.payload.userId;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.username = null;
      state.userId = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;