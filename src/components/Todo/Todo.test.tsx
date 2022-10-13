import { render, screen } from "@testing-library/react";
import Todo from "./Todo";

describe("<Todo/>", () => {
    it("should render without errors", () => {
        render(<Todo title={"TODO_TITLE"} done={false} />);
        screen.getByText("TODO_TITLE");
        const doneButton = screen.getByText("Done");
        expect(doneButton).toBeInTheDocument();
    })
    it("should render without errors", () => {
        render(<Todo title={"TODO_TITLE"} done={true} />);
        const title = screen.getByText("TODO_TITLE");
        expect(title.classList.contains("done")).toBe(true);
        screen.getByText("Undone");
    })
});