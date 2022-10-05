import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { MemoryRouter, Route, Routes } from "react-router"
import { TodoState } from "../../store/slices/todo"
import { getMockStore } from "../../test-utils/mock"
import TodoDetail from "./TodoDetail"

const stubInitialState: TodoState = {
  todos:[
    { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
  ],
  selectedTodo: { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false }
}

const mockStore = getMockStore({ todo: stubInitialState });


describe("<TodoDetail/>", () => {
  let todoDetail: JSX.Element;
  todoDetail = (
      <Provider store={mockStore}>
        <MemoryRouter>
            <Routes>
              <Route path="/" element={<TodoDetail/>} />
            </Routes>
        </MemoryRouter>
      </Provider>
  );

  it("should render correctly", () => {
    render(todoDetail);
    const title = screen.getByText("TODO_TEST_TITLE_1");
    const content = screen.getByText("TODO_TEST_CONTENT_1");
    expect(title.classList.contains("right")).toBe(true);
    expect(content.classList.contains("right")).toBe(true);
  })
})