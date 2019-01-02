import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Drawer from './Drawer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router>
      <Drawer
        open={false}
        closeDrawer={() => {}}
        openDrawer={() => {}} />
    </Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
