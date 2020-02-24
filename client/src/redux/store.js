import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

// redux middleware for spread param
const middleware = [thunk];

// build args to compose
const composeArgs = [];
composeArgs.push(applyMiddleware(...middleware));

if (process.env.NODE_ENV !== 'production')
  composeArgs.push(
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

// create and export redux store
const store = createStore(rootReducer, compose(...composeArgs));

export default store;

// const middleware = [thunk];
// const store = createStore(
//   rootReducer,
//   compose(
//     applyMiddleware(...middleware),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   )
// );
