import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { TodoState } from "../../store/slices/todo";
import { getMockStore, mockDispatch } from "../../test-utils/mocks";
import TodoDetail from "./TodoDetail";

const stubInitialState: TodoState = {
  todos: [],
  selectedTodo: { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
};
const mockStore = getMockStore({ todo: stubInitialState });

describe("<TodoDetail />", () => {
  let todoDetail: JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    todoDetail = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<TodoDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });

  it("should render without errors", () => {
    const { container } = render(todoDetail);
    expect(container).toBeTruthy();
  });

  it("should dispatch", () => {
    render(todoDetail);
    expect(mockDispatch).toHaveBeenCalled();
  })

  it("should contain selected Todo", () => {
    render(todoDetail);
    screen.getByText("TODO_TEST_TITLE_1");
    screen.getByText("TODO_TEST_CONTENT_1")
  })
});
