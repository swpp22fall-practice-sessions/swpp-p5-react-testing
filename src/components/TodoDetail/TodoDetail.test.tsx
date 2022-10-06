import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, Navigate } from "react-router";
import { TodoState } from "../../store/slices/todo";
import { getMockStore } from "../../test-utils/mocks";
import TodoDetail from "./TodoDetail";
import axios from "axios";

const stubInitialState: TodoState = {
    todos: [
      { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
   ],
    selectedTodo: null,
};

// const c = getMockStore({ todo: stubInitialState });

describe("<TodoDetail />", () => {
    let todoDetail: JSX.Element;
    beforeEach(() => {
        jest.clearAllMocks();
        todoDetail = (
            <Provider store={getMockStore({ todo: stubInitialState })}>
             {/* <Provider store={c}> */}
                <MemoryRouter>
                <Routes>
                    <Route path="/todo-detail/:id" element={<TodoDetail />} />
                    <Route path="*" element={<Navigate to={"/todo-detail/3"} />} />
                </Routes>
                </MemoryRouter>
            </Provider>
        );
    });
    it("should render TodoDetail", () => {
        const { container } = render(todoDetail);
        expect(container).toBeTruthy();
    });
    it("should render w/o errors", async () => {
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
    it("should not render if empty", async () => {
        jest.spyOn(axios, "get").mockImplementation(() => Promise.reject());
        render(todoDetail);
        expect(screen.queryAllByText("TODO_TEST_TITLE_3")).toHaveLength(0);
        expect(screen.queryAllByText("TODO_TEST_CONTENT_3")).toHaveLength(0);
    });
});