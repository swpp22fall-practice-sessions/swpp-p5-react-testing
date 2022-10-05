// containers/TodoList/TodoList.test.tsx
import { IProps as TodoProps } from "../../components/Todo/Todo";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { getMockStore } from "../../test-utils/mocks";
import TodoList from "./TodoList";
import { TodoState } from "../../store/slices/todo";

jest.mock("../../components/Todo/Todo", () => (props: TodoProps) => (
  //this data-testid is fake id
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
    {
      id: 1,
      title: "TODO_TEST_TITLE_1",
      content: "TODO_TEST_CONTENT_1",
      done: false,
    },
    {
      id: 2,
      title: "TODO_TEST_TITLE_2",
      content: "TODO_TEST_CONTENT_2",
      done: false,
    },
    {
      id: 3,
      title: "TODO_TEST_TITLE_3",
      content: "TODO_TEST_CONTENT_3",
      done: false,
    },
  ],
  selectedTodo: null,
};
const mockStore = getMockStore({ todo: stubInitialState });

const mockNavigate = jest.fn();

//외부 dependency useNavigate
jest.mock("react-router", () => ({
  //그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));
const mockDispatch = jest.fn();

//useDispatch mockign
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  //useDispatch만 우리가 mocking
  useDispatch: () => mockDispatch,
}));

describe("<TodoList />", () => {
  let todoList: JSX.Element;
  beforeEach(() => {
    //mock들을 다 지우기
    jest.clearAllMocks();
    todoList = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route
              path="/"
              element={<TodoList title="TODOLIST_TEST_TITLE" />}
            />
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
    //initailly 3개 넣기로 했기 때문에 3개
    expect(todos).toHaveLength(3);
  });
  it("should handle clickDetail", () => {
    render(todoList);
    const todos = screen.getAllByTestId("spyTodo");
    const todo = todos[0];
    // eslint-disable-next-line testing-library/no-node-access
    const title = todo.querySelector(".title");
    //querySelector는 class name을 이용해서 받음
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
