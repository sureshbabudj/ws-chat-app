import { combineReducers, createStore } from 'redux';
import { loginReducer } from './pages/login/LoginReducer';
import { threadReducer } from './components/chat-bar/ThreadReducer';
import polling from './polling/pollingReducer';

const store = createStore(
    combineReducers({loginReducer, threadReducer, ...polling}),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
 
export default store;
