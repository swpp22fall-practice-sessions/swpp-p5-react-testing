import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, Navigate } from "react-router";
import * as todoSlice  from "../../../store/slices/todo";
import { getMockStore } from "../../../test-utils/mocks";
import NewTodo from "./NewTodo";
import axios from "axios";

const stubInitialState: todoSlice.TodoState = {
    todos: [
      { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
   ],
    selectedTodo: null,
};

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
    let newTodo: JSX.Element;
    beforeEach(() => {
        jest.clearAllMocks();
        newTodo = (
            <Provider store={getMockStore({ todo: stubInitialState })}>
             {/* <Provider store={c}> */}
                <MemoryRouter>
                <Routes>
                    <Route path="/" element={<NewTodo />} />
                    <Route path="*" element={<Navigate to={"/"} />} />
                </Routes>
                </MemoryRouter>
            </Provider>
        );
    });
    it("should render newTodo", () => {
        const { container } = render(newTodo);
        expect(container).toBeTruthy();
    });
    it("should render navigate to /todos when submitted", async () => {
        jest.spyOn(axios, "post").mockResolvedValueOnce({
          data: {
            id: 1,
            title: "TITLE",
            content: "CONTENT",
            done: false,
          },
        });
        render(newTodo);
        const titleInput = screen.getByLabelText("Title");
        const contentInput = screen.getByLabelText("Content");
        const submitButton = screen.getByText("Submit");
        fireEvent.change(titleInput, { target: { value: "TITLE" } });
        fireEvent.change(contentInput, { target: { value: "CONTENT" } });
        await screen.findByDisplayValue("TITLE");
        await screen.findByDisplayValue("CONTENT");
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/todos"));
      });
      it("should alert error when submitted", async () => {
        const mockPostTodo = jest.spyOn(todoSlice, "postTodo");
        window.alert = jest.fn();
        console.error = jest.fn();
        jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("ERROR"));
        render(newTodo);
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
      });
});