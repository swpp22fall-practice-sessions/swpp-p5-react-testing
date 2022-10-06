import { Provider } from 'react-redux';
import { TodoState } from '../../store/slices/todo';
import { getMockStore } from '../../test-utils/mock';
import { MemoryRouter } from 'react-router';
import { Navigate, Route, Routes } from 'react-router-dom';
import TodoDetail from './TodoDetail';
import { render, screen } from '@testing-library/react';
import axios from 'axios';

const stubInitialState: TodoState = {
    todos: [
        { id: 3, title: 'TODO_TEST_TITLE_3', content: 'TODO_TEST_CONTENT_3', done: false },
    ],
    selectedTodo: null,
}

const mockStore = getMockStore({ todo: stubInitialState })

describe('<TodoDetail/>', () => {
    let todoDetail: JSX.Element = (
        <Provider store={mockStore}>
            <MemoryRouter>
                <Routes>
                    <Route path='/todo-detail/:id' element={<TodoDetail />} />
                    <Route path='*' element={<Navigate to={'/todo-detail/3'} />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    )

    it('should render TodoDetail', async () => {
        jest.spyOn(axios, 'get').mockImplementation(() => {
            return Promise.resolve({
                data: {
                    id: 3,
                    title: 'TODO_TEST_TITLE_3',
                    content: 'TODO_TEST_CONTENT_3',
                    done: false,
                },
            })
        })
        render(todoDetail)
        await screen.findByText('TODO_TEST_TITLE_3')
        await screen.findByText('TODO_TEST_CONTENT_3')
    })

    it('should not render if there is no todo', async () => {
        render(todoDetail)
        jest.spyOn(axios, 'get').mockImplementationOnce(() => Promise.reject())
        expect(screen.queryAllByText('TODO_TEST_TITLE_3')).toHaveLength(0)
    })
})
