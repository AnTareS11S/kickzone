import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    unreadCount: 0,
  },
  reducers: {
    setUnreadNotifications: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadNotifications: (state) => {
      state.unreadCount += 1;
    },
    clearUnreadNotifications: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  setUnreadNotifications,
  incrementUnreadNotifications,
  clearUnreadNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
