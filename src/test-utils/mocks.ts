import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../store";
import todoReducer from "../store/slices/todo";
export const getMockStore = (preloadedState?: PreloadedState<RootState>) => {
return configureStore({
 reducer: { todo: todoReducer },
 preloadedState,
 });
};
