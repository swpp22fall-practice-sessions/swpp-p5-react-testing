
import { render, screen }from '@testing-library/react';
import Todo from "./Todo"

describe('<Todo />', () => {
  it("should render done mark when done is true", () => {
    render(<Todo title={"Todo title"} done={true}/>);
    const title = screen.getByText("Todo title");
    expect(title.classList.contains("done")).toBe(true);
    screen.getByText("Undone")
  });
  it("should render done mark when done is false", () => {
    render(<Todo title={"Todo title"} done={false}/>);
    const title = screen.getByText("Todo title");
    expect(title.classList.contains("done")).toBe(false);
    screen.getByText("Done")
  });
})
