import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { RootState } from "../store";
import todoReducer from "../store/slices/todo";

export const getMockStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer: { todo: todoReducer },
        preloadedState,
    });
};

export function renderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState,
        // Automatically create a store instance if no store was passed in
        store = getMockStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren): JSX.Element {
        return <Provider store={store}>{children}</Provider>;
    }

    // Return an object with the store and all of RTL's query functions
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}