import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  business: {},
  chatData: {},
};

const slice = createSlice({
  name: "state",
  initialState: initialState,
  reducers: {
    setBusiness: (state, { payload }) => {
      state.business = payload;
    },
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setChat: (state, { payload }) => {
      state.chatData = payload;
    },
  },
});

export default slice.reducer;

export const { setUser, setBusiness, setChat } = slice.actions;
