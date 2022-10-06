import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import todoReducer, { deleteTodo, fetchTodo, fetchTodos, postTodo, TodoState, TodoType, toggleDone } from "./todo";

describe('todo reducer', () => {
  let store: EnhancedStore<
    { todo: TodoState },
    AnyAction,
    [ThunkMiddleware<{ todo: TodoState }, AnyAction, undefined>]
  >;
  const fakeTodo: TodoType = { id: 1, title: 'test', content: 'test', done: false };

  beforeAll(() => {
    store = configureStore({
      reducer: { todo: todoReducer },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(todoReducer(undefined, { type: 'unknown' })).toEqual({
      todos: [],
      selectedTodo: null,
    });
  });

  it('should handle fetchTodos', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: [fakeTodo] });
    await store.dispatch(fetchTodos());
    expect(store.getState().todo.todos).toEqual([fakeTodo]);
  });

  it('should handle fetchTodo', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: fakeTodo });
    await store.dispatch(fetchTodo(1));
    expect(store.getState().todo.selectedTodo).toEqual(fakeTodo);
  });

  it('should handle null on fetchTodo', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: null });
    await store.dispatch(fetchTodo(1));
    expect(store.getState().todo.selectedTodo).toEqual(null);
  });

  it('should handle deleteTodo', async () => {
    axios.delete = jest.fn().mockResolvedValue({ data: null });
    await store.dispatch(deleteTodo(1));
    expect(store.getState().todo.todos).toEqual([]);
  });

  it('should handle postTodo', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: fakeTodo });
    await store.dispatch(postTodo({ title: 'test', content: 'test' }));
    expect(store.getState().todo.todos).toEqual([fakeTodo]);
  });

  it('should handle error on postTodo', async () => {
    const mockConsoleError = jest.fn();
    console.error = mockConsoleError;
    jest.spyOn(axios, 'post').mockRejectedValue({
      response: { data: { title: ['error'] } },
    });
    await store.dispatch(postTodo({ title: 'test', content: 'test' }));
    expect(mockConsoleError).toBeCalled();
  });

  it('should handle toggleDone', async () => {
    jest.spyOn(axios, 'put').mockResolvedValue({ data: fakeTodo });
    await store.dispatch(toggleDone(fakeTodo.id));
    expect(store.getState().todo.todos.find((v) => {
      return v.id === fakeTodo.id;
    })?.done).toEqual(true);
  });

  it('should handle not existing todo toggle', async () => {
    const beforeState = store.getState().todo;
    jest.spyOn(axios, 'put').mockResolvedValue({
      data: { ...fakeTodo, id: 10 },
    });
    await store.dispatch(toggleDone(2));
    expect(store.getState().todo).toEqual(beforeState);
  });
});
