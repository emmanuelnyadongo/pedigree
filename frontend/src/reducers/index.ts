import { combineReducers } from "@reduxjs/toolkit";
import { formOptionsReducer } from "./formOptions";
import { tokenReducer } from "./token";
import { breedsReducer } from "./breeds";
import { cultivarsReducer } from "./cultivars";

export const rootReducer = combineReducers({
  formOptions: formOptionsReducer,
  token: tokenReducer,
  breeds: breedsReducer,
  cultivars: cultivarsReducer,
});
