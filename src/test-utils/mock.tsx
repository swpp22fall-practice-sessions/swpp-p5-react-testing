import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { AppStore, RootState } from "../store";
import { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import todoReducer from "../store/slices/todo";

export const getMockStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: { todo: todoReducer },
    preloadedState,
  });
};

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    store = getMockStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
