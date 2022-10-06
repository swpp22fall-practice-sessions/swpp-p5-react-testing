import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import { renderWithProviders } from "../../test-utils/mocks";
import TodoDetail from "./TodoDetail";
import { screen } from "@testing-library/react";
import axios from "axios";

const renderTodoDetail = () => {
  //this is render
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
            {
              id: 3,
              title: "title3",
              content: "content3",
              done: false,
            },
          ],
          selectedTodo: null,
        },
      },
    }
  );
};

describe("<TodoDetail/>", () => {
  it("should render todo", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => {
      return Promise.resolve({
        data: {
          id: 3,
          title: "title3",
          content: "content3",
          done: false,
        },
      });
    });
    //render todo detail must happen after jest mocking
    renderTodoDetail();
    await screen.findByText("title3");
    //only findbyDisplayValue works on await
    await screen.findByText("content3");
  });
});
