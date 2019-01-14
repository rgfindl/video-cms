import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from '../../../store';
import Login from './Login';

it('renders without crashing', () => {
  const store = configureStore({});
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><Login /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
