import axios from "axios";
import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import { renderWithProviders } from "../../test-utils/mocks";
import TodoDetail from "./TodoDetail";
import {screen} from "@testing-library/react";

const renderTodoDetail = () => {
    renderWithProviders(
        <MemoryRouter>
            <Routes>
                <Route path="/todo-detail/:id" element={<TodoDetail/>}/>
                <Route path="*" element={<Navigate to={"/todo-detail/2"}/>}/>
            </Routes>
        </MemoryRouter>,
        {
            preloadedState: {
                todo: {
                    todos: [
                        {id:2, title:"TODO_TEST_TITLE_2", content:"TODO_TEST_CONTENT_2", done: false},
                    ],
                    selectedTodo: null,
                }
            }
        }
    )
};


describe("<TodoDetail />", ()=>{
    it("should render without errors", async()=> {
        jest.spyOn(axios, "get").mockImplementation(()=>{
            return Promise.resolve({
                data: {
                    id: 2,
                    title:"TODO_TEST_TITLE_2",
                    content:"TODO_TEST_CONTENT_2",
                    done:false,
                },
            });
        });
        renderTodoDetail();
        await screen.findByText("TODO_TEST_TITLE_2");
        await screen.findByText("TODO_TEST_CONTENT_2");    
    });
    it("should not render if there is no todo", async()=>{
        renderTodoDetail();
        jest.spyOn(axios, "get").mockImplementationOnce(()=>Promise.reject());
        expect(screen.queryAllByText("TODO_TEST_TITLE_2")).toHaveLength(0);
    });
});