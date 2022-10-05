import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import { IProps as TodoProps } from "../../components/Todo/Todo";
import { TodoState } from "../../store/slices/todo";
import { renderWithProviders } from "../../test-utils/mock";
import { getMockStore } from "../../test-utils/mock";
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

describe("<TodDetail />", () => {
    it("should render without errors", async () => {
        jest.spyOn(axios, "get").mockImplementation(() => {
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
    
      it("should not render if there is no todo", async () => {
        renderTodoDetail();
        jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject());
        expect(screen.queryAllByText("TODO_TEST_TITLE_3")).toHaveLength(0);
      });
});