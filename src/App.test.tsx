import { render, screen } from "@testing-library/react";

import App from "./App";
import { Provider } from 'react-redux';
import { store } from './store';

test("renders App.tsx", () => {
    render(<Provider store={store}>
        <App/>
    </Provider>);
    // screen.debug();
    // expect(true).toBe(true)
});
