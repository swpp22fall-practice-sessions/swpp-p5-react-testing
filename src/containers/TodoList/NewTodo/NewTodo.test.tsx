import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import NewTodo from "./NewTodo";
import * as todoSlice from "../../../store/slices/todo";
import { renderWithProviders } from "../../../test-utils/mocks";

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
        screen.getByText("Add a Todo");
    });

    it("should render title input", () => {
        renderWithProviders(<NewTodo />);
        screen.getByLabelText("Title");
    })

    it("should render title input", () => {
        renderWithProviders(<NewTodo />);
        screen.getByLabelText("Content");
    })

    it("should render submit button", () => {
        renderWithProviders(<NewTodo />);
        screen.getByText("Submit");
    })

    it("should show details when button clicked", async () => {
        jest.spyOn(axios, "post").mockResolvedValueOnce({
            data: {
                id: 1,
                title: "test Title",
                content: "test Content",
                done: false,
            }
        });
        renderWithProviders(<NewTodo />);
        const title = screen.getByLabelText("Title");
        const content = screen.getByLabelText("Content");
        const button = screen.getByText("Submit");

        fireEvent.change(title, { target: { value: "test Title" } });
        fireEvent.change(content, { target: { value: "test Content" } });

        await screen.findByDisplayValue("test Title");
        await screen.findByDisplayValue("test Content");

        fireEvent.click(button);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/todos"));
    });

    it("should return error when button clicked", async () => {
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
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Error on post Todo"));
    })
})