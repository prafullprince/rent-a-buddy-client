import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "@/redux/slice/event.slice";
import chatReducer from "@/redux/slice/chat.slice";

export const store = configureStore({
  reducer: {
    event: eventReducer,
    chat: chatReducer
  },
//   devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
