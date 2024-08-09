import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import state from "./state";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  state: state,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
