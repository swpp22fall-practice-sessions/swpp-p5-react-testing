import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";

import NewTodo from "./NewTodo";
import * as todoSlice from "../../../store/slices/todo";
import { store } from "../../../store";
import { Provider } from "react-redux";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Navigate: (props: any) => {
    mockNavigate(props.to);
    return null;
  },
  useNavigate: () => mockNavigate,
}));

describe("<NewTodo />", () => {
  it("should render without errors", () => {
    render(
        <Provider store={store}>
            <NewTodo />
        </Provider>
    );
    screen.getByText("Add a Todo");
  });
  it("should render title input", () => {
    render(
        <Provider store={store}>
            <NewTodo />
        </Provider>
    );
    screen.getByLabelText("Title");
  });
  it("should render content input", () => {
    render(
        <Provider store={store}>
            <NewTodo />
        </Provider>
    );
    screen.getByLabelText("Content");
  });
  it("should render submit button", () => {
    render(
        <Provider store={store}>
            <NewTodo />
        </Provider>
    );
    screen.getByText("Submit");
  });
  it("should render navigate to /todos when submitted", async () => {
    jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        id: 1,
        title: "TITLE",
        content: "CONTENT",
        done: false,
      },
    });
    render(
        <Provider store={store}>
            <NewTodo />
        </Provider>
    );
    const titleInput = screen.getByLabelText("Title");
    const contentInput = screen.getByLabelText("Content");
    const submitButton = screen.getByText("Submit");
    fireEvent.change(titleInput, { target: { value: "TITLE" } });
    fireEvent.change(contentInput, { target: { value: "CONTENT" } });
    await screen.findByDisplayValue("TITLE");
    await screen.findByDisplayValue("CONTENT");
    fireEvent.click(submitButton);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/todos"));
  });
  it("should alert error when submitted", async () => {
    const mockPostTodo = jest.spyOn(todoSlice, "postTodo");
    window.alert = jest.fn();
    console.error = jest.fn();
    jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("ERROR"));
    render(
        <Provider store={store}>
            <NewTodo />
        </Provider>
    );
    const titleInput = screen.getByLabelText("Title");
    const contentInput = screen.getByLabelText("Content");
    const submitButton = screen.getByText("Submit");
    fireEvent.change(titleInput, { target: { value: "TITLE" } });
    fireEvent.change(contentInput, { target: { value: "CONTENT" } });

    await screen.findByDisplayValue("TITLE");
    await screen.findByDisplayValue("CONTENT");
    fireEvent.click(submitButton);

    expect(mockPostTodo).toHaveBeenCalledWith({
      title: "TITLE",
      content: "CONTENT",
    });
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Error on post Todo"));
  });
});