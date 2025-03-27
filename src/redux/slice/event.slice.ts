import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@reduxjs/toolkit/query";

interface eventState {
  step: number,
  event: any
}

const initialState: eventState = {
  step: 1,
  event: null
};


const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setStep(state:any, action: PayloadAction<Number>) {
        state.step = action.payload
    },
    setEvent(state:any, action: PayloadAction<any>) {
        state.event = action.payload
    }
  },
});

export const { setStep, setEvent } = eventSlice.actions;
export default eventSlice.reducer;
