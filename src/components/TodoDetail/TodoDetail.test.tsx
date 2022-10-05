import axios from "axios";
import TodoDetail from "./TodoDetail";
import { TodoState } from "../../store/slices/todo";
import { fireEvent, render, screen } from "@testing-library/react";
import { getMockStore } from "../../test-utils/mocks";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, Navigate } from "react-router";


const stubInitialState: TodoState = {
    todos: [
        { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
        { id: 2, title: "TODO_TEST_TITLE_2", content: "TODO_TEST_CONTENT_2", done: false },
        { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
    ],
    selectedTodo: null,
};

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

const mockStore = getMockStore({ todo: stubInitialState });

describe("<TodoDetail />", () => {
    let todoDetail: JSX.Element;
    beforeEach(() => {
        jest.clearAllMocks();
        todoDetail = (
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/todo-detail/:id" element={<TodoDetail />} />
                        <Route path="*" element={<Navigate to = {"/todo-detail/1"} /> } />
                        <Route path="*" element={<Navigate to = {"/todo-detail/2"} /> } />
                        <Route path="*" element={<Navigate to = {"/todo-detail/3"} /> } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
    })

    it("should render TodoDetail", async () => {
        const { container } = render(todoDetail);
        expect(container).toBeTruthy();
    });
});