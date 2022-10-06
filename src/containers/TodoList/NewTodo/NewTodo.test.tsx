import { fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import * as todoSlice from "../../../store/slices/todo";
import { getMockStore, renderWithProviders } from "../../../test-utils/mocks";
import NewTodo from "./NewTodo";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  //그래야 NavLink 같은 걸 쓸 수 있다.
  ...jest.requireActual("react-router"),
  Navigate: (props: any) => {
    //we need to check navigate to
    mockNavigate(props.to);
    return null;
  },
  useNavigate: () => mockNavigate,
}));

describe("the test of NewTodo", () => {
  //branch submitted
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render NewTodo", () => {
    renderWithProviders(<NewTodo />);
    screen.getByText("Add a Todo");
  });
  it("should change inputs on enter", async () => {
    //this changes the dispatch return value
    axios.post = jest.fn().mockResolvedValueOnce({
      //this is the result value
      data: {
        id: 1,
        title: "안녕하세요",
        content: "내용 채우기",
        done: false,
      },
    });
    renderWithProviders(<NewTodo />);
    const titleInput = screen.getByLabelText("Title");
    const contentInput = screen.getByLabelText("Content");
    const submitButton = screen.getByText("Submit");
    fireEvent.change(titleInput, { target: { value: "안녕하세요" } });
    fireEvent.change(contentInput, { target: { value: "내용 채우기" } });
    await screen.findByDisplayValue("안녕하세요"); //test setstate
    await screen.findByDisplayValue("내용 채우기"); //test setstate
    fireEvent.click(submitButton);
    //this waits for dispatch being called
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/todos"));
  });
  it("should alert when inputs are empty", async () => {
    const mockPostTodo = jest.spyOn(todoSlice, "postTodo");
    window.alert = jest.fn();
    console.error = jest.fn();
    axios.post = jest.fn().mockResolvedValueOnce(new Error());
    renderWithProviders(<NewTodo />);
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
    await waitFor(() => expect(window.alert).toBeCalled());
  });
});
