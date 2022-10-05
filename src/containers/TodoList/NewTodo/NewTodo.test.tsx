import { fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import NewTodo from "./NewTodo";
import { renderWithProviders } from "../../../test-utils/mocks";

const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
        ...jest.requireActual("react-router-dom"),//only change Navigate
        Navigate: (props:any) => {
            mockNavigate(props.to);
            return null;
        },
    }));
describe("<NewTodo />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("rendering components", () => {
        renderWithProviders(<NewTodo />);
        screen.getByText("Add a Todo");
        screen.getByLabelText("Title");
        screen.getByLabelText("Content");
        screen.getByText("Submit");
    });
    it("submit button is clicked", async () => {
        jest.spyOn(axios, "post").mockResolvedValueOnce({
            data: {
                id: 1,
                title: "TITLE",
                content: "CONTENT",
                done: false,
            },
        });
        renderWithProviders(<NewTodo />);
        const titleInput = screen.getByLabelText("Title");
        const contentInput = screen.getByLabelText("Content");
        const submitButton = screen.getByText("Submit");
        fireEvent.change(titleInput, { target: { value: "TITLE" } });
        fireEvent.change(contentInput, { target: { value: "CONTENT" } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/todos"));
    });
    it("error on submit",async()=>{
        window.alert = jest.fn();
        console.error = jest.fn();
        jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("ERROR"));//when post error occurs
        renderWithProviders(<NewTodo />);
        const submitButton = screen.getByText("Submit");
        fireEvent.click(submitButton);
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Error on post Todo"));
    })
});