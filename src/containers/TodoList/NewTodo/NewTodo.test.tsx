import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { keyboard } from "@testing-library/user-event/dist/keyboard";
import axios from "axios";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { getMockStore } from "../../../test-utils/mocks";
import NewTodo from "./NewTodo";

const mockStore = getMockStore({ todo: { todos: [], selectedTodo: null } });

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Navigate: (props: any) => {
    mockNavigate(props.to);
    return null;
  },
  useNavigate: () => mockNavigate,
}));

describe("<TodoList />", () => {
  let newTodo: JSX.Element;
  beforeEach(() => {
    jest.clearAllMocks();
    newTodo = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<NewTodo />} />
            <Route path="/*" element={<></>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });
  it("should render TodoList", () => {
    const { container } = render(newTodo);
    expect(container).toBeTruthy();
    const inputs = screen
      .getAllByRole("textbox")
      .filter((x) => x.tagName === "INPUT");
    expect(inputs.length).toBe(1);
  });
  it("should show title", () => {
    render(newTodo);
    const titleInput = screen
      .getAllByRole("textbox")
      .filter((x) => x.tagName === "INPUT")[0] as HTMLInputElement;
    titleInput.focus();
    keyboard("TITLE_1");
    expect(titleInput.value).toBe("TITLE_1");
  });
  it("should show content", () => {
    render(newTodo);
    const contentInput = screen
      .getAllByRole("textbox")
      .filter((x) => x.tagName === "TEXTAREA")[0] as HTMLTextAreaElement;
    contentInput.focus();
    keyboard("CONTENT_1");
    expect(contentInput.value).toBe("CONTENT_1");
  });
  it("should navigate after submit", async () => {
    const mockPost = jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: {
        id: 1,
        title: "TITLE_1",
        content: "CONTENT_1",
        done: false,
      },
    });
    render(newTodo);
    const inputs = screen.getAllByRole("textbox");
    const titleInput = inputs.find(
      (x) => x.tagName === "INPUT"
    ) as HTMLInputElement;
    const contentInput = inputs.find(
      (x) => x.tagName === "TEXTAREA"
    ) as HTMLInputElement;
    titleInput.focus();
    keyboard("TITLE_1");
    contentInput.focus();
    keyboard("CONTENT_1");
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/todos"));
    await waitFor(() =>
      expect(mockPost).toHaveBeenCalledWith("/api/todo/", {
        title: "TITLE_1",
        content: "CONTENT_1",
      })
    );
  });
  it("should alert error after submit", async () => {
    const mockPost = jest
      .spyOn(axios, "post")
      .mockRejectedValueOnce(new Error());
    render(newTodo);
    console.error = jest.fn();
    const inputs = screen.getAllByRole("textbox");
    const titleInput = inputs.find(
      (x) => x.tagName === "INPUT"
    ) as HTMLInputElement;
    const contentInput = inputs.find(
      (x) => x.tagName === "TEXTAREA"
    ) as HTMLInputElement;
    titleInput.focus();
    keyboard("TITLE_1");
    contentInput.focus();
    keyboard("CONTENT_1");
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    await waitFor(() =>
      expect(mockPost).toHaveBeenCalledWith("/api/todo/", {
        title: "TITLE_1",
        content: "CONTENT_1",
      })
    );
  });
});
