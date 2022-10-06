import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { TodoState } from "../../../store/slices/todo";
import { getMockStore } from "../../../test-utils/mocks";
import NewTodo from "./NewTodo";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const stubInitialState: TodoState = {
  todos: [
    { id: 1, title: 'TODO_TEST_TITLE_1', content: 'TODO_TEST_CONTENT_1', done: false },
    { id: 2, title: 'TODO_TEST_TITLE_2', content: 'TODO_TEST_CONTENT_2', done: false },
    { id: 3, title: 'TODO_TEST_TITLE_3', content: 'TODO_TEST_CONTENT_3', done: false },
  ],
  selectedTodo: null,
};
const mockStore = getMockStore({ todo: stubInitialState });

describe('<NewTodo />', () => {
  let newTodo: JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    newTodo = (
      <Provider store={mockStore}>
        <MemoryRouter>
          <Routes>
            <Route path='/' element={<NewTodo />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });

  it('should render NewTodo', () => {
    const { container } = render(newTodo);
    expect(container).toBeTruthy();
  });

  it('should handle postTodoHandler when fulfilled', async () => {
    const fakeResult = { type: 'todo/postTodo/fulfilled' };
    mockDispatch.mockResolvedValue(fakeResult);

    render(newTodo);
    const titleField = screen.getByLabelText('Title');
    const contentField = screen.getByLabelText('Content');
    const submitButton = screen.getByText('Submit');
    fireEvent.change(titleField, {
      target: { value: 'TEST_TITLE' },
    });
    fireEvent.change(contentField, {
      target: { value: 'TEST_CONTENT' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });

  });

  it('should handle postTodoHandler when rejected', async () => {
    const fakeResult = { type: 'todo/postTodo/rejected' };
    mockDispatch.mockResolvedValue(fakeResult);
    global.alert = jest.fn();

    render(newTodo);
    const titleField = screen.getByLabelText('Title');
    const contentField = screen.getByLabelText('Content');
    const submitButton = screen.getByText('Submit');
    fireEvent.change(titleField, {
      target: { value: 'TEST_TITLE' },
    });
    fireEvent.change(contentField, {
      target: { value: 'TEST_CONTENT' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    });
  });
});
