import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux'
import configureStore from '../../store';
import Main from './Main';

it('renders without crashing', () => {
  const store = configureStore({});
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><Router>
    <Main />
  </Router></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
