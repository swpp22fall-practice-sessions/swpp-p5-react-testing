import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { postTodo } from "../../../store/slices/todo";
import * as todoSlice from '../../../store/slices/todo'
import { getMockStore } from "../../../test-utils/mocks";
import NewTodo from "./NewTodo";

const mockStore = getMockStore();

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Navigate: (props: any) => {
    mockNavigate(props.to);
    return null;
  },
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

describe("<NewTodo />", () => {
  let newTodo: JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    newTodo = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<NewTodo />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });

  it("should render without errors", () => {
    const { container } = render(newTodo);
    expect(container).toBeTruthy();
  });

  it("should have submit button", () => {
    render(newTodo);
    const button = screen.getByText("Submit");
    expect(button.tagName).toEqual("BUTTON");
  });

  it("should handle successful post todo", async () => {
    render(newTodo);
    mockDispatch.mockResolvedValueOnce({
      type: `${postTodo.typePrefix}/fulfilled`,
    });
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
    render(newTodo);
    const mockPostTodo = jest.spyOn(todoSlice, "postTodo");
    window.alert = jest.fn();
    console.error = jest.fn();
    jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("ERROR"));
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
