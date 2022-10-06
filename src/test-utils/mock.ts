import { PreloadedState } from 'redux';
import { RootState } from '../store';
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from "../store/slices/todo";

export const getMockStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer: { todo: todoReducer },
        preloadedState,
    })
}
