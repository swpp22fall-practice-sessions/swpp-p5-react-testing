import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { Provider } from 'react-redux';
import { getMockStore } from '../../../test-utils/mocks';
import NewTodo from './NewTodo';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-redux'),
  Navigate: (props: any) => {
    mockNavigate(props.to);
    return null;
  },
  useNavigate: () => mockNavigate,
}));

describe('<NewTodo />', () => {
  const store = getMockStore();
  it('should render without errors', () => {
    render(
      <Provider store={store}>
        <NewTodo />
      </Provider>
    );
    screen.getByText('Add a Todo');
    screen.getByText('Title');
    screen.getByText('Submit');
  });
  it('should handle navigate to /todos when button is clicked', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        id: 1,
        title: 'foo',
        content: 'bar',
        done: true,
      },
    });
    render(
      <Provider store={store}>
        <NewTodo />
      </Provider>
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/todos'));
  });
  it('should handle input change', () => {
    render(
      <Provider store={store}>
        <NewTodo />
      </Provider>
    );
    const titleInput = screen.getByLabelText('Title');
    const contentInput = screen.getByLabelText('Content');
    fireEvent.change(titleInput, { target: { value: 'TITLE' } });
    fireEvent.change(contentInput, { target: { value: 'CONTENT' } });
    screen.getByDisplayValue('TITLE');
    screen.getByDisplayValue('CONTENT');
  });
  it('should alert error when not submitted', async () => {
    jest.spyOn(axios, 'post').mockRejectedValueOnce(null);
    window.alert = jest.fn();
    console.error = jest.fn();
    render(
      <Provider store={store}>
        <NewTodo />
      </Provider>
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('Error on post Todo')
    );
  });
});
