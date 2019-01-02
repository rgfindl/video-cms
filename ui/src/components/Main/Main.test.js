import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Main from './Main';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router>
    <Main />
  </Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
