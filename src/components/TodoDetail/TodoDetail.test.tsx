import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { TodoState } from "../../store/slices/todo";
import { getMockStore } from "../../test-utils/mocks";
import TodoDetail from "./TodoDetail";

const stubInitialState: TodoState = {
  todos: [],
  selectedTodo: {
    id: 1,
    title: "TODO_TEST_TITLE_1",
    content: "TODO_TEST_CONTENT_1",
    done: false,
  },
};
const mockStore = getMockStore({ todo: stubInitialState });

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

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
  it("should render TodoDetail", async () => {
    const { container } = render(todoDetail);
    expect(container).toBeTruthy();
    expect(screen.queryAllByText("TODO_TEST_TITLE_1")).toHaveLength(1);
    expect(screen.queryAllByText("TODO_TEST_CONTENT_1")).toHaveLength(1);
  });
});
