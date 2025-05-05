/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface chatState {
  totalUnseenMessages: number;
  totalUnseenMessage: {
    [chatId: string]: number
  },
  openChatMobile: boolean;
}

// initial state
const initialState: chatState = {
  totalUnseenMessages: 0,
  totalUnseenMessage: {

  },
  openChatMobile: false,
};

// create slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setTotalUnseenMessages: (state, action: PayloadAction<any>) => {
      state.totalUnseenMessages = action.payload;
    },
    setTotalUnseenMessagesOfChat: (state, action: PayloadAction<any>) => {
        const { chatId, count } = action.payload;
        state.totalUnseenMessage[chatId] = count;
    },
    setOpenChatMobile: (state, action: PayloadAction<any>) => {
      state.openChatMobile = action.payload;
    },
  },
});

export const { setTotalUnseenMessages, setTotalUnseenMessagesOfChat, setOpenChatMobile } = chatSlice.actions;
export default chatSlice.reducer;
