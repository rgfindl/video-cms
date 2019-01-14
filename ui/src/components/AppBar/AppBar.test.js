import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux'
import configureStore from '../../store';
import AppBar from './AppBar';

it('renders without crashing', () => {
  const store = configureStore({
    display: {
      drawerOpen: false,
      inProgress: false,
      alertOpen: false,
      error: ''
    }
  });
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}>
    <Router>
      <AppBar />
    </Router>
  </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
