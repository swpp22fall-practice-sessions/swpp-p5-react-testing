import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./store";

import App from "./App";

test("renders App.tsx", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  // eslint-disable-next-line testing-library/no-debugging-utils
  screen.debug();
});
