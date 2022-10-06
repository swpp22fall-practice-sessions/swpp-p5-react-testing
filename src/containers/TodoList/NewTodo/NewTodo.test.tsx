import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NewTodo from './NewTodo';
import axios from 'axios';
import * as todoSlice from "../../../store/slices/todo";
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { Navigate, Route, Routes } from 'react-router-dom';
import TodoDetail from '../../../components/TodoDetail/TodoDetail';
import { getMockStore } from '../../../test-utils/mock';
import { TodoState } from '../../../store/slices/todo';

const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    Navigate: (props: any) => {
        mockNavigate(props.to);
        return null;
    },
    useNavigate: () => mockNavigate,
}))

const stubInitialState: TodoState = {
    todos: [],
    selectedTodo: null,
}

const mockStore = getMockStore({ todo: stubInitialState })

describe('<NewTodo/>', () => {
    let todoDetail: JSX.Element = (
        <Provider store={mockStore}>
            <NewTodo/>
        </Provider>
    )

    it('should render without errors', () => {
        render(todoDetail)
        screen.getByText('Add a Todo')
    })
    it('should render title input', () => {
        render(todoDetail)
        screen.getByLabelText('Title')
    })
    it('should render content input', () => {
        render(todoDetail)
        screen.getByLabelText('Content')
    })
    it('should render submit button', () => {
        render(todoDetail)
        screen.getByText('Submit')
    })
    it('should render navigate to /todos when submitted', async () => {
        jest.spyOn(axios, 'post').mockResolvedValueOnce({
            data: {
                id: 1,
                title: 'TITLE',
                content: 'CONTENT',
                done: false,
            },
        })
        render(todoDetail)
        const titleInput = screen.getByLabelText('Title')
        const contentInput = screen.getByLabelText('Content')
        const submitButton = screen.getByText('Submit')
        fireEvent.change(titleInput, { target: { value: 'TITLE' }})
        fireEvent.change(contentInput, { target: { value: 'CONTENT' }})
        await screen.findByDisplayValue('TITLE')
        await screen.findByDisplayValue('CONTENT')
        fireEvent.click(submitButton)

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/todos'))
    })
    it('should alert error when submitted', async () => {
        const mockPostTodo = jest.spyOn(todoSlice, 'postTodo')
        window.alert = jest.fn()
        console.error = jest.fn()
        jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error('ERROR'))

        render(todoDetail)
        const titleInput = screen.getByLabelText('Title')
        const contentInput = screen.getByLabelText('Content')
        const submitButton = screen.getByText('Submit')
        fireEvent.change(titleInput, { target: { value: 'TITLE' }})
        fireEvent.change(contentInput, { target: { value: 'CONTENT' }})
        await screen.findByDisplayValue('TITLE')
        await screen.findByDisplayValue('CONTENT')
        fireEvent.click(submitButton)

        expect(mockPostTodo).toHaveBeenCalledWith({
            title: 'TITLE',
            content: 'CONTENT',
        })
        await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled())
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Error on post Todo'))
    })
})
