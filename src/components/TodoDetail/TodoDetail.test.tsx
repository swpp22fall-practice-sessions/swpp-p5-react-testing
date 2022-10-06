import { render, screen } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "../../store";
import { fetchTodo, fetchTodos } from "../../store/slices/todo";
import TodoDetail from "./TodoDetail";

describe("<TodoDetail />", () => {
    it("should render without errors", () => {
        render(
            <Provider store={store}>
                <TodoDetail />
            </Provider>
        );
        screen.getByText("Name:");
        screen.getByText("Content:");
    });

    const fakeTodo = {
        id: 1, title: "test", content: "test", done: false
    };
    it("should handle fetchTodo", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: fakeTodo });
        await store.dispatch(fetchTodo(1));
        expect(store.getState().todo.selectedTodo).toEqual(fakeTodo); 
    });
})