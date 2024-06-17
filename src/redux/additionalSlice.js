// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "additionalSlice",
  initialState: {
    addDetails: {},
  },
  reducers: {
    takeAddDetails: (state, action) => {
      state.addDetails = action.payload;
    },
  },
});

export const { takeAddDetails } = authSlice.actions;

export default authSlice.reducer;
