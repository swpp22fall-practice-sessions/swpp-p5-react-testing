import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { TodoState } from "../../store/slices/todo";
import { getMockStore } from "../../test-utils/mocks";
import TodoDetail from "./TodoDetail";

const stubInitialState: TodoState = {
    todos: [
     { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
     { id: 2, title: "TODO_TEST_TITLE_2", content: "TODO_TEST_CONTENT_2", done: false },
     { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
     ],
    selectedTodo: null,
};
const mockStore = getMockStore({ todo: stubInitialState });

describe("<Todo />", () => {
    it("should render without errors", () => {
        render(<Provider store={mockStore} ><TodoDetail/></Provider>);
        const name = screen.getByText("Name:");
        const content = screen.getByText("Content:");
        expect(name).toBeInTheDocument(); 
        expect(content).toBeInTheDocument();
    });
    
});