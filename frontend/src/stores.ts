import { rootReducer } from "./reducers/index.ts";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: rootReducer,
});
