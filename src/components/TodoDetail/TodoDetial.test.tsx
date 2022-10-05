import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { store } from "../../store";
import { TodoState } from "../../store/slices/todo";
import { getMockStore } from "../../test-utils/mocks";
import TodoDetail from "./TodoDetail";

const stubInitialState: TodoState = {
    todos: [
        { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
    ],
    selectedTodo: { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
};
const mockStore = getMockStore({ todo: stubInitialState });

describe("<TodoList />", () => {
    let todoList: JSX.Element;
    beforeEach(() => {
        jest.clearAllMocks();
        todoList = (
            <Provider store={mockStore}>
                <div data-testid="spyTodoDetail">
                    <div className="row">
                        <div className="left">Name:</div>
                        <div className="right">{store.getState().todo.selectedTodo?.title}</div>
                    </div>
                    <div className="row">
                        <div className="left">Content:</div>
                        <div className="right">{store.getState().todo.selectedTodo?.content}</div>
                    </div>
                </div>
            </Provider>
        );
    });
    it("should render TodoDetail", () => {
        const { container } = render(todoList);
        expect(container).toBeTruthy();
    });
    it("should return error", () => {
        render(todoList);
        const todos = screen.getAllByTestId("spyTodo");
        expect(todos).toHaveLength(3);
    });
});