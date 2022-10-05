import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import * as todoSlice from "../../../store/slices/todo";
import { renderWithProviders } from "../../../test-utils/mock";
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
    it("should render without error", async () => {
        renderWithProviders(<NewTodo />);
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
        const mockPostTodo = jest.spyOn(todoSlice, "postTodo");
        window.alert = jest.fn();
        console.error = jest.fn();
        jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("ERROR"));
        renderWithProviders(<NewTodo />);
        const titleInput = screen.getByLabelText("Title");
        const contentInput = screen.getByLabelText("Content");
        const submitButton = screen.getByText("Submit");
        fireEvent.change(titleInput, { target: { value: "TITLE" } });
        fireEvent.change(contentInput, { target: { value: "CONTENT" } });

        await screen.findByDisplayValue("TITLE");
        await screen.findByDisplayValue("CONTENT");
        fireEvent.click(submitButton);

        expect(mockPostTodo).toHaveBeenCalledWith({
            title: "TITLE",
            content: "CONTENT",
        });
        await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
        await waitFor(() =>
            expect(window.alert).toHaveBeenCalledWith("Error on post Todo")
        );
    });
});
