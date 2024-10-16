import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    unreadCount: 0,
  },
  reducers: {
    setUnreadMessages: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadMessages: (state) => {
      state.unreadCount += 1;
    },
    clearUnreadMessages: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const {
  setUnreadMessages,
  incrementUnreadMessages,
  clearUnreadMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
