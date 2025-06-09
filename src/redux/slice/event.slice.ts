/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface eventState {
  step: number;
  event: any;
  editEvent: boolean;
  isOpen: boolean;
  editService: boolean;
}

// initial state
const initialState: eventState = {
  step: 1,
  event: null,
  editEvent: false,
  isOpen: false,
  editService: false,
};

// create slice
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setStep(state: any, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    setEvent(state: any, action: PayloadAction<any>) {
      state.event = action.payload;
    },
    setEditEvent(state: any, action: PayloadAction<boolean>) {
      state.editEvent = action.payload;
    },
    setIsOpen(state: any) {
      state.isOpen = !state.isOpen;
    },
    setEditService(state: any, action: PayloadAction<boolean>) {
      state.editService = action.payload;
    },
  },
});

export const { setStep, setEvent, setEditEvent, setIsOpen, setEditService } = eventSlice.actions;
export default eventSlice.reducer;
