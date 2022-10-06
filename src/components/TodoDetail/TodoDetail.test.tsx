import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { TodoState } from '../../store/slices/todo';
import { getMockStore } from '../../test-utils/mocks';
import TodoDetail from './TodoDetail';

const stubInitialState: TodoState = {
  todos: [
    { id: 1, title: 'TODO_TEST_TITLE_1', content: 'TODO_TEST_CONTENT_1', done: false },
    { id: 2, title: 'TODO_TEST_TITLE_2', content: 'TODO_TEST_CONTENT_2', done: false },
    { id: 3, title: 'TODO_TEST_TITLE_3', content: 'TODO_TEST_CONTENT_3', done: false },
  ],
  selectedTodo: null,
};
const mockStore = getMockStore({ todo: stubInitialState });

describe('<TodoDetail />', () => {
  let todoDetail: JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    todoDetail = (
      <Provider store={mockStore}>
        <TodoDetail />
      </Provider>
    );
  });

  it('should render TodoDetail', () => {
    const { container } = render(todoDetail);
    expect(container).toBeTruthy();
  });
});
