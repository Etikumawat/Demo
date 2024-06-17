// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "attachedFiles",
  initialState: {
    panFile: {},
    msmeFile: {},
    gstFile: {},
    cnlChequeFile: {},
    adAttachedFile: {},
    pfAttachedFile: {},
  },
  reducers: {
    handleMsmeFile: (state, action) => {
      state.msmeFile = action.payload;
    },
    handlePanFile: (state, action) => {
      state.panFile = action.payload;
    },
    handleGstFile: (state, action) => {
      state.gstFile = action.payload;
    },
    handleCnlChequeFile: (state, action) => {
      state.cnlChequeFile = action.payload;
    },
    handleAdAttachedFile: (state, action) => {
      state.adAttachedFile = action.payload;
    },
    handlePFAttachedFile: (state, action) => {
      state.pfAttachedFile = action.payload;
    },
  },
});

export const {
  handleMsmeFile,
  handleGstFile,
  handleCnlChequeFile,
  handlePanFile,
  handleAdAttachedFile,
  handlePFAttachedFile,
} = authSlice.actions;

export default authSlice.reducer;
