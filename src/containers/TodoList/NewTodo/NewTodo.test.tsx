import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import { TodoState } from "../../../store/slices/todo";
import { getMockStore, renderWithProviders } from "../../../test-utils/mock";
import NewTodo from "./NewTodo";

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
    Navigate: (props: any) => {
        mockNavigate(props.to);
        return null;
    },
    useNavigate: () => mockNavigate,
}));

describe("<NewTodo />", () => {
    it("should render NewTodo", () => {
        renderWithProviders(<NewTodo />);
    });
    it("should handle changes in title", async () => {
        renderWithProviders(<NewTodo />);
        const titleInput = screen.getByLabelText("Title");
        fireEvent.change(titleInput, { target: { value: "TITLE" } });
        await screen.findByDisplayValue("TITLE");
    });
    it("should handle changes in content", async () => {
        renderWithProviders(<NewTodo />);
        const contentInput = screen.getByLabelText("Content");
        fireEvent.change(contentInput, { target: { value: "CONTENT" } });
        await screen.findByDisplayValue("CONTENT");
    });
    it("should handle submit button", async () => {
        jest.spyOn(axios, "post").mockResolvedValue({
            data: {
                id: 1,
                title: "TITLE",
                content: "CONTENT",
                done: false,
            },
        })
        renderWithProviders(<NewTodo />);

        const submit = screen.getByText("Submit");
        fireEvent.click(submit);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/todos"));
    });
    it("should alert error when submitted", async () => {
        jest.spyOn(axios, "post").mockRejectedValue(new Error("ERROR"));
        window.alert = jest.fn();
        console.error = jest.fn();
        
        renderWithProviders(<NewTodo />);

        const submit = screen.getByText("Submit");
        fireEvent.click(submit);

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Error on post Todo"));
    });
});