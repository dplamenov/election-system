import { createStore } from 'redux'

function providerReducer(state = {}, action) {
  switch (action.type) {
    case 'set':
      return action.payload
    default:
      return state
  }
}

// let store = 
export const store = createStore(providerReducer);

store.subscribe(() => console.log(store.getState()))
