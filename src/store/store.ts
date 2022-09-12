import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import weatherReducer from "./weather/weatherSlice";

const rootReducer = combineReducers({
  weatherReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
