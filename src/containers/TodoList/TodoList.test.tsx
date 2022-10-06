import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { TodoState } from "../../store/slices/todo";
import { getMockStore } from "../../test-utils/mock";
import TodoList from "./TodoList";
import { IProps as TodoProps } from "../../components/Todo/Todo";

jest.mock("../../components/Todo/Todo", () => (props: TodoProps) => (
  <div data-testid="spyTodo">
    <div className="title" onClick={props.clickDetail}>
      {props.title}
    </div>
    <button className="doneButton" onClick={props.clickDone}>
      done
    </button>
    <button className="deleteButton" onClick={props.clickDelete}>
      delete
    </button>
  </div>
));

const stubInitialState: TodoState = {
  todos: [
    { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
    { id: 2, title: "TODO_TEST_TITLE_2", content: "TODO_TEST_CONTENT_2", done: false },
    { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
  ],
  selectedTodo: null,
};
const mockStore = getMockStore({ todo: stubInitialState });

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

describe("<TodoList />", () => {
  let todoList: JSX.Element;
  beforeEach(() => {
    jest.clearAllMocks();
    todoList = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<TodoList title="TODOLIST_TEST_TITLE" />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });
  it("should render TodoList", () => {
    const { container } = render(todoList);
    expect(container).toBeTruthy();
  });
  it("should render todos", () => {
    render(todoList);
    const todos = screen.getAllByTestId("spyTodo");
    expect(todos).toHaveLength(3);
  });
  it("should handle clickDetail", () => {
    render(todoList);
    const todos = screen.getAllByTestId("spyTodo");
    const todo = todos[0];
    // eslint-disable-next-line testing-library/no-node-access
    const title = todo.querySelector(".title");
    fireEvent.click(title!);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
  it("should handle clickDone", () => {
    render(todoList);
    const todos = screen.getAllByTestId("spyTodo");
    const todo = todos[0];
    // eslint-disable-next-line testing-library/no-node-access
    const doneButton = todo.querySelector(".doneButton");
    fireEvent.click(doneButton!);
    expect(mockDispatch).toHaveBeenCalled();
  });
  it("should handle clickDelete", () => {
    render(todoList);
    const todos = screen.getAllByTestId("spyTodo");
    const todo = todos[0];
    // eslint-disable-next-line testing-library/no-node-access
    const deleteButton = todo.querySelector(".deleteButton");
    fireEvent.click(deleteButton!);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
