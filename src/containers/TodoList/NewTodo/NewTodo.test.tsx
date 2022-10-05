import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import * as todoSlice from "../../../store/slices/todo";
import { renderWithProviders } from "../../../test-utils/mocks";
import NewTodo from "./NewTodo";

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
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should render without error", async () => {
        render(<NewTodo />);
        screen.getByText("Add a Todo");
        screen.getByLabelText("Title");
        screen.getByLabelText("Content");
        screen.getByText("Submit");
    });
    it("should navigate to Todos when successful PostTodoHandler", async () => {
        jest.spyOn(axios, "post").mockResolvedValue({
            data: {
                id: 1,
                title: "Title",
                content: "Content",
                done: false,
            },
        });
        renderWithProviders(<NewTodo />);
        const title = screen.getByLabelText("Title");
        fireEvent.change(title, { target: { value: "Title" } });
        await screen.findByDisplayValue("Title");
        const content = screen.getByLabelText("Content");
        fireEvent.change(content, { target: { value: "Content" } });
        await screen.findByDisplayValue("Content");
        const doneButton = screen.getByText("Submit");
        fireEvent.click(doneButton!);
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/todos")
        );
    });
    it("should error when unsuccessful PostTodoHandler", async () => {
        window.alert = jest.fn();
        console.error = jest.fn();
        jest.spyOn(axios, "post").mockRejectedValue(new Error("error"));
        render(<NewTodo />);
        const mockPostTodo = jest.spyOn(todoSlice, "postTodo");
        const title = screen.getByLabelText("Title");
        fireEvent.change(title, { target: { value: "Title" } });
        screen.findByDisplayValue("Title");
        const content = screen.getByLabelText("Content");
        fireEvent.change(content, { target: { value: "Content" } });
        screen.findByDisplayValue("Content");
        const doneButton = screen.getByText("Submit");
        fireEvent.click(doneButton!);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockPostTodo).toHaveBeenCalledWith({
            title: "Title",
            content: "Content",
        });
        expect(window.alert).toHaveBeenCalledWith("Error on post Todo");
    });
});
