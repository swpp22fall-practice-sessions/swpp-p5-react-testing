it("should handle error on postTodo", async () => {
   const mockConsoleError = jest.fn();
   console.error = mockConsoleError;
   jest.spyOn(axios, "post").mockRejectedValue({
     response: { data: { title: ["error"] } },
   });
   await store.dispatch(
     postTodo({ title: "test", content: "test" })
);
   expect(mockConsoleError).toBeCalled();
 });
it("should handle not existing todo toggle", async () => {
  const beforeState = store.getState().todo
  jest.spyOn(axios, "put").mockResolvedValue({
    data: { ...fakeTodo, id: 10 },
  });
  await store.dispatch(toggleDone(2));
  expect(store.getState().todo).toEqual(beforeState)
});

it("should handle null on fetchTodo", async () => {
  axios.get = jest.fn().mockResolvedValue({ data: null });
  await store.dispatch(fetchTodo(1));
  expect(store.getState().todo.selectedTodo).toEqual(null); });
