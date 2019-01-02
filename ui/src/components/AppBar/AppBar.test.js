import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import AppBar from './AppBar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router>
    <AppBar />
  </Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
