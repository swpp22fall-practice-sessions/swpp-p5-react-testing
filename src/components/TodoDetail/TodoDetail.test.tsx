import { screen } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import { renderWithProviders } from "../../test-utils/mocks";
import TodoDetail from "./TodoDetail";

const renderTodoDetail = () => {
  renderWithProviders(
    <MemoryRouter>
      <Routes>
        <Route path="/todo-detail/:id" element={<TodoDetail />} />
        <Route path="*" element={<Navigate to={"/todo-detail/3"} />} />
      </Routes>
    </MemoryRouter>,
    {
      preloadedState: {
        todo: {
          todos: [
            { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
          ],
          selectedTodo: null,
        },
      },
    }
  );
};

describe("<TodoDetail />", () => {
    it("should render without errors", async () => {
      jest.spyOn(axios, "get").mockImplementation(() => {//this mocks useEffect's dispatch
        return Promise.resolve({
          data: {
            id: 3,
            title: "TODO_TEST_TITLE_3",
            content: "TODO_TEST_CONTENT_3",
            done: false,
          },
        });
      });
      renderTodoDetail();
      await screen.findByText("TODO_TEST_TITLE_3");
      await screen.findByText("TODO_TEST_CONTENT_3");
    });
  });