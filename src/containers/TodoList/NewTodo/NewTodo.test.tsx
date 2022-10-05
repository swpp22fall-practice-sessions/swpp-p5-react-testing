import { fireEvent, getByLabelText, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { renderWithProviders } from "../../../test-utils/mocks";
import NewTodo from "./NewTodo";

const renderNewTodo = () => {
    renderWithProviders(
        <NewTodo />,
        {
            preloadedState: {
                todo: {
                    todos: [],
                    selectedTodo: null,
                },
            },
        }
    );
};

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
    Navigate: (props: {to: string}) => {
        mockNavigate(props.to);
        return null;
    },
}));

describe("<NewTodo />", () => {
    beforeEach(() => {
        renderNewTodo();
    })
    it("should render without errors", () => {
        screen.getByText("Add a Todo");
        screen.getByLabelText("Title");
        screen.getByLabelText("Content");
        screen.getByText("Submit");
    });
    it("should render navigate to /todos when submitted", async () => {
        axios.post = jest.fn().mockResolvedValue({
            data: {
                id: 3,
                title: "TODO_TEST_TITLE_3",
                content: "TODO_TEST_CONTENT_3",
                done: false,
            },
        });
        fireEvent.change(screen.getByLabelText("Title"), {target: {value: "TEST_TITLE"}});
        fireEvent.change(screen.getByLabelText("Content"), {target: {value: "TEST_CONTENT"}});
        screen.getByDisplayValue("TEST_TITLE");
        screen.getByDisplayValue("TEST_CONTENT");
        fireEvent.click(screen.getByText("Submit"));
        await waitFor(()=>expect(mockNavigate).toHaveBeenCalledWith("/todos"));
    });
    it("should handle error when submitted", async () => {
        axios.post = jest.fn().mockResolvedValue({
            data: null,
        });
        window.alert = jest.fn();
        console.error = jest.fn();
        fireEvent.change(screen.getByLabelText("Title"), {target: {value: "TEST_TITLE"}});
        fireEvent.change(screen.getByLabelText("Content"), {target: {value: "TEST_CONTENT"}});
        screen.getByDisplayValue("TEST_TITLE");
        screen.getByDisplayValue("TEST_CONTENT");
        fireEvent.click(screen.getByText("Submit"));
        await waitFor(()=>expect(mockNavigate).not.toHaveBeenCalled());
        await waitFor(()=>expect(window.alert).toHaveBeenCalledWith("Error on post Todo"));
    });
});
