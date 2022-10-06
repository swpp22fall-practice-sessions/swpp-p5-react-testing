import { screen } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import { renderWithProviders } from "../../test-utils/mock";
import TodoDetail from "./TodoDetail";

const renderTodoDetail = () => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/todo-detail/:id" element={<TodoDetail />} />
        <Route path="*" element={<Navigate to={"/todo-detail/1"} />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        todo: {
          todos: [
            { id: 1, title: "TEST_TITLE", content: "TEST_CONTENT", done: false },
          ],
          selectedTodo: null,
        },
      },
    }
  );
};

describe("<TodoDetail />", () => {
  it("should render without errors", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({
        data: {
          id: 1,
          title: "TEST_TITLE",
          content: "TEST_CONTENT",
          done: false,
        },
      });
    });
    renderTodoDetail();
    await screen.findByText("TEST_TITLE");
    await screen.findByText("TEST_CONTENT");
  });

  it("should not render if there is no todo", async () => {
    renderTodoDetail();
    jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject());
    expect(screen.queryAllByText("TEST_TITLE")).toHaveLength(0);
  });
});
