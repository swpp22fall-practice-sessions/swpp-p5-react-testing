import { render, screen } from "@testing-library/react";
import Todo from "./Todo";

describe("<Todo />", () => {
  it("should render without errors", () => {
    render(<Todo title={"TODO_TITLE"} done={false} />);
    screen.getByText("TODO_TITLE"); // Implicit assertion
    const doneButton = screen.getByText("Done"); // Implicit assertion
    expect(doneButton).toBeInTheDocument(); // Explicit assertion
  });
});
