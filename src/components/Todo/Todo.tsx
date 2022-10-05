import "./Todo.css";
import { render, screen } from "@testing-library/react";

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

export interface IProps {
  title: string;
  clickDetail?: React.MouseEventHandler<HTMLDivElement>; // Defined by React
  clickDone?: () => void;
  clickDelete?: () => void;
  done: boolean;
}

const Todo = (props: IProps) => {
  return (
    <div className="Todo">
      <div className={`text ${props.done && "done"}`} onClick={props.clickDetail}>
        {props.title}
      </div>
      {props.done && <div className="done-mark">&#x2713;</div>}
      <button className={props.done ? "UndoneButton" : "doneButton"} onClick={props.clickDone}>
        {props.done ? "Undone" : "Done"}
      </button>
      <button onClick={props.clickDelete}>Delete</button>
    </div>
  );
};
export default Todo;
