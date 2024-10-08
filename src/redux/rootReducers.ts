import { combineReducers, configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import filter from "./slices/filter";

const rootReducer = combineReducers({
  auth: auth,
  filter: filter,
}) as any;

export default rootReducer;
