import { createSlice } from "@reduxjs/toolkit";

const TokenSlice = createSlice({
  name: "message",
  initialState: {
    token: null,
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { setToken } = TokenSlice.actions;
export default TokenSlice.reducer;