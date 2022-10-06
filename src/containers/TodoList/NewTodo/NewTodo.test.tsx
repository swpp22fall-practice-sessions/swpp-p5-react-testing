import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { getMockStore } from "../../../test-utils/mocks";
import NewTodo from "./NewTodo";
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Navigate: (props: any) => {
    mockNavigate(props.to);
    return null;
  },
  useNavigate: () => mockNavigate,
}));
const mockStore = getMockStore({ todo: { todos: [], selectedTodo: null } });
let newTodo: JSX.Element;
describe("<TodoList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    newTodo = (
      <Provider store={mockStore}>
        <NewTodo />
      </Provider>
    );
  });

  it("should render without errors", () => {
    const { container } = render(newTodo);
    expect(container).toBeTruthy();
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
    render(newTodo);
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
});
