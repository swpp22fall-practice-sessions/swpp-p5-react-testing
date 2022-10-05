import { render, screen } from "@testing-library/react";
import Todo from "./Todo";
describe("<Todo />", () => {
    it("should render done mark without errors", () => {
        render(<Todo title={"TODO_TITLE"} done={false} />);
        screen.getByText("TODO_TITLE"); // Implicit assertion
        const doneButton = screen.getByText("Done"); // Implicit assertion
        expect(doneButton).toBeInTheDocument(); // Explicit assertion
    });
    it("should render undone mark without errors", () => {
        render(<Todo title={"TODO_TITLE"} done={true} />);
        screen.getByText("TODO_TITLE"); // Implicit assertion
        const doneButton = screen.getByText("Undone"); // Implicit assertion
        expect(doneButton).toBeInTheDocument(); // Explicit assertion
    });
});