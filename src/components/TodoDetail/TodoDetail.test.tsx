import { screen } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import TodoDetail from "./TodoDetail";

import { renderWithProviders } from "../../test-utils/mock";

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
            { id: 1, title: "todo_detail_test1", content: "todo_detail_test1_content", done: false },
          ],
          selectedTodo: null,
        },
      },
    }
  );
};

describe("<TodoDetail />", () => {
  it("should render one data without error", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({
        data: {
          id: 1,
          title: "todo_detail_test1",
          content: "todo_detail_test1_content",
          done: false,
        },
      });
    });
    renderTodoDetail();
    await screen.findByText("todo_detail_test1");
    await screen.findByText("todo_detail_test1_content");
  });
});