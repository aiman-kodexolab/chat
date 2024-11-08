import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatData: {},
};

const slice = createSlice({
  name: "state",
  initialState: initialState,
  reducers: {
    setChat: (state, { payload }) => {
      state.chatData = payload;
    },
  },
});

export default slice.reducer;

export const { setChat } = slice.actions;
