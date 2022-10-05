import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store";

test("renders Apps.tsx", () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
    );
    screen.debug();
    expect(true).toBe(false);
});
