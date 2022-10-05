import { render, screen } from "@testing-library/react";
import Todo from "./Todo";

describe("<Todo />", () => {
  it("should render without errors", () => {
    render(<Todo title={"TODO_TITLE"} done={false} />);
    screen.getByText("TODO_TITLE"); // Implicit assertion
    const doneButton = screen.getByText("Done"); // Implicit assertion
    expect(doneButton).toBeInTheDocument(); // Explicit assertion
  });
  it("should render done mark when done is true", () => {
    render(<Todo title={"TODO_TITLE"} done={true} />);
    const title = screen.getByText("TODO_TITLE");
    expect(title.classList.contains("done")).toBe(true);
    screen.getByText("Undone");
  });
  it("should render undone mark when done is false", () => {
    render(<Todo title={"TODO_TITLE"} done={false} />);
    const title = screen.getByText("TODO_TITLE");
    expect(title.classList.contains("done")).toBe(false);
    screen.getByText("Done");
  });
});
