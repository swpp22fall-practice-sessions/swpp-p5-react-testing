import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { getMockStore } from "../../test-utils/mock";
import { TodoState } from "../../store/slices/todo";
import axios from "axios";
import TodoDetail from "./TodoDetail";

const stubInitialState: TodoState = {
  todos: [
    { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
  ],
  selectedTodo: null,
};
const mockStore = getMockStore({ todo: stubInitialState });

describe("<TodoDetail />", () => {
  let todoDetail: JSX.Element;

  beforeEach(()=>{
    jest.clearAllMocks();
    todoDetail = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<TodoDetail/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  });
  
  it("should not render if there is no todo", async () => {
    render(todoDetail);
    jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject());
    expect(screen.queryAllByText("TODO_TEST_TITLE_3")).toHaveLength(0);
  });

  it("should render without errors", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({
        data: {
          id: 3,
          title: "TODO_TEST_TITLE_3",
          content: "TODO_TEST_CONTENT_3",
          done: false,
        },
      });
    });
    render(todoDetail);
    await screen.findByText("TODO_TEST_TITLE_3");
    await screen.findByText("TODO_TEST_CONTENT_3");
  });

});