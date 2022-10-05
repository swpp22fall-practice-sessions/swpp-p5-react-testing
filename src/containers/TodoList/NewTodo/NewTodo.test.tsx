import {Provider} from "react-redux";
import {MemoryRouter, Route, Routes} from "react-router";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {getMockStore} from "../../../test-utils/mock";
import NewTodo from "./NewTodo";
import {TodoState} from "../../../store/slices/todo";
import axios from "axios";
import * as todoSlice from "../../../store/slices/todo";

const stubInitialState: TodoState = {
  todos: [
    { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
    { id: 2, title: "TODO_TEST_TITLE_2", content: "TODO_TEST_CONTENT_2", done: false },
    { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
  ],
  selectedTodo: { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
};

const mockStore = getMockStore({ todo: stubInitialState });

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Navigate: (props: any) => {
    mockNavigate(props.to);
    return null;
  },
  useNavigate: () => mockNavigate,
}));

describe("<NewTodo/>", () => {
  let newTodo: JSX.Element;
  beforeEach(()=>{
    jest.clearAllMocks();
    newTodo = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<NewTodo/>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  });
  it("should render NewTodo", () => {
    const {container} = render(newTodo);
    expect(container).toBeTruthy();
  });
  it("should set title when input changes", async () => {
    render(newTodo);
    const titleInput = screen.getByLabelText("Title");
    fireEvent.change(titleInput, {target: {value: 'Title test'}})
    await screen.findByDisplayValue("Title test");
  });
  it("should set contents when input changes", async () => {
    render(newTodo);
    const contentInput = screen.getByLabelText("Content");
    fireEvent.change(contentInput, {target: {value: 'Content test'}})
    await screen.findByDisplayValue("Content test");
  });
  it("should render navigate to /todos when submitted", async () => {
    jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        id: 1,
        title: "Title test",
        content: "Content test",
        done: false,
      },
    });
    render(newTodo);
    const titleInput = screen.getByLabelText("Title");
    const contentInput = screen.getByLabelText("Content");
    const submitButton = screen.getByText("Submit");
    fireEvent.change(titleInput, { target: { value: "Title test" } });
    fireEvent.change(contentInput, { target: { value: "Content test" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/todos"));
  });
  it("should alert error when submitted", async () => {
    const mockPostTodo = jest.spyOn(todoSlice, "postTodo");
    window.alert = jest.fn();
    console.error = jest.fn();
    jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("ERROR"));
    render(newTodo);
    const titleInput = screen.getByLabelText("Title");
    const contentInput = screen.getByLabelText("Content");
    const submitButton = screen.getByText("Submit");
    fireEvent.change(titleInput, { target: { value: "Title test" } });
    fireEvent.change(contentInput, { target: { value: "Content test" } });
    fireEvent.click(submitButton);
    expect(mockPostTodo).toHaveBeenCalledWith({
      title: "Title test",
      content: "Content test",
    });
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Error on post Todo"));
  });
});