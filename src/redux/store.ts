import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slice/auth.slice";
import eventReducer from "@/redux/slice/event.slice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
  },
//   devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
