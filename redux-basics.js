const { configureStore } = require("@reduxjs/toolkit");

const initialState = { number: 0 }; // default state

// create identity reducer
const reducer = (state = initialState, action) => {
  if (action.type === 'ADD') { return ({ ...state, number: state.number + 1}); }
  else if (action.type === 'ADD_VALUE') {
    return ({
      ...state, number: state.number + action.value
    });
  }
  return state;
}


// create redux store
const store = configureStore({ reducer: reducer });

store.subscribe(() => {
  console.log('[Subscription]', store.getState());
});


store.dispatch({ type: 'ADD' });
store.dispatch({ type: 'ADD_VALUE', value: 5 });

console.log(store.getState());