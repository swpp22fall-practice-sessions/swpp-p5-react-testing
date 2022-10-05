import {TodoState} from "../../store/slices/todo";
import {getMockStore} from "../../test-utils/mocks";
import {MemoryRouter, Route, Routes} from "react-router";
import TodoList from "../../containers/TodoList/TodoList";
import {Provider} from "react-redux";


const stubInitialState: TodoState = {
  todos: [
    { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
    { id: 2, title: "TODO_TEST_TITLE_2", content: "TODO_TEST_CONTENT_2", done: false },
    { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
  ],
  selectedTodo:
    { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
};

const mockStore = getMockStore({ todo: stubInitialState });

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

describe("<TodoDetail/>", () => {
  let todoDetail: JSX.Element;
  beforeEach(()=>{
    jest.clearAllMocks();
    todoDetail = (
      <Provider store={mockStore}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<TodoList title="TODOLIST_TEST_TITLE" />} />
      </Routes>
      </MemoryRouter>
      </Provider>
    )
  })
})