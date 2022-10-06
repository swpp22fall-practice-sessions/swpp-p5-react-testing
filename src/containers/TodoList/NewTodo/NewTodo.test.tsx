import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import axios from "axios";
import { Provider, useDispatch } from "react-redux";
import { TodoState } from "../../../store/slices/todo";
import { getMockStore } from "../../../test-utils/mock";
import NewTodo from "./NewTodo"

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    Navigate: (props: any) => {
        mockNavigate(props.to);
    },
}));


const stubInitialState: TodoState = {
    todos: [
        { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
        { id: 2, title: "TODO_TEST_TITLE_2", content: "TODO_TEST_CONTENT_2", done: false },
        { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
    ],
    selectedTodo: null,
};

const mockStore = getMockStore({ todo: stubInitialState });

describe("<NewTodo/>", () => {

    beforeEach(() => { jest.clearAllMocks() });

    it("should render NewTodo", () => {
        render(<Provider store={mockStore}><NewTodo/></Provider>);

        const mockDispatch = jest.fn();
        jest.mock('react-redux', () => ({
            ...jest.requireActual("react-redux"),
            useDispatch: () => mockDispatch
        }));

        const button = screen.getAllByRole("button");
        const textboxes = screen.getAllByRole("textbox");
        expect(button).toHaveLength(1);
        expect(textboxes).toHaveLength(2);
    })

    it("should handle postTodo", async () => {
        render(<Provider store={mockStore}><NewTodo/></Provider>);

        jest.spyOn(axios, "post").mockResolvedValueOnce({
            data: {
                id: 1,
                title: "TITLE",
                content: "CONTENT",
                done: false,
            },
        });

        const button = screen.getAllByRole("button");
        const textboxes = screen.getAllByRole("textbox");
        fireEvent.change(textboxes[0], { target: {value: "NEW_TODO_TITLE"}});
        fireEvent.change(textboxes[1], { target: {value: "NEW_TODO_CONTENT"}});
        fireEvent.click(button[0]);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/todos"));
    })

    it("should handle postTodo error",async () => {
        const mockAlert = jest.fn();
        window.alert = mockAlert;
        const mockConsoleError = jest.fn();
        console.error = mockConsoleError;
        jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("ERROR"));

        render(<Provider store={mockStore}><NewTodo/></Provider>);
        const button = screen.getAllByRole("button");
        const textboxes = screen.getAllByRole("textbox");
        fireEvent.change(textboxes[0], { target: {value: "NEW_TODO_TITLE"}});
        fireEvent.change(textboxes[1], { target: {value: "NEW_TODO_CONTENT"}});
        fireEvent.click(button[0]);
        await waitFor(() => expect(mockAlert).toHaveBeenCalledWith("Error on post Todo"));
        await waitFor(() => expect(mockConsoleError).toHaveBeenCalled());
    })
})