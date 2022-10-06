import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { getMockStore } from "../../../test-utils/mock";
import { TodoState } from "../../../store/slices/todo";
import axios from "axios";
import NewTodo from "./NewTodo";
import * as todoSlice from "../../../store/slices/todo";

const stubInitialState: TodoState = {
  todos: [
    {id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false},
  ],
  selectedTodo: null,
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

describe("<NewTodo/>", ()=>{
  let newTodo: JSX.Element;

  beforeEach(()=>{
    jest.clearAllMocks();
    newTodo = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<NewTodo/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  });
  afterEach(() => { jest.clearAllMocks() });

  it("should render NewTodo", ()=>{
    const {container} = render(newTodo);
    expect(container).toBeTruthy();
  });
  it("should render title", ()=>{
    render(newTodo);
    screen.getByText("Add a Todo");
  });
  it("should render title input", ()=>{
    render(newTodo);
    screen.getByLabelText("Title");
  });
  it("should render content input", ()=>{
    render(newTodo);
    screen.getByLabelText("Content");
  });
  it("should render submit button", ()=>{
    render(newTodo);
    screen.getByText("Submit");
  });
  it("should navigate to /todos when new todo submitted", async ()=>{
    jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        id: 1,
        title: "TITLE",
        content: "CONTENT",
        done: false,
      }
    });
    render(newTodo);
    const title = screen.getByLabelText("Title");
    const content = screen.getByLabelText("Content");
    const submit = screen.getByText("Submit");

    fireEvent.change(title, {target: {value: "TITLE"}});
    fireEvent.change(content, {target: {value: "CONTENT"}});

    await screen.findByDisplayValue("TITLE");
    await screen.findByDisplayValue("CONTENT");

    fireEvent.click(submit);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/todos"));
  })
  it("should alert error when submitted", async () => {
    const mockPostTodo = jest.spyOn(todoSlice, "postTodo");
    window.alert = jest.fn();
    console.error = jest.fn();
    jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("ERROR"));
    render(newTodo);
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
})