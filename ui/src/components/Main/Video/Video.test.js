import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Video from './Video';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><Video /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
