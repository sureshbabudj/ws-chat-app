
import React from 'react';
import Polling from './polling/polling';
import { Provider } from 'react-redux';
import './App.scss';
import store from './store';
import Nav from './components/nav/Nav';

function App() {
  return (
    <Provider store={store}>
        <Nav />
        <Polling />
    </Provider>
  );
}

export default App;
