import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from '../../../store';
import GoogleSignInButton from './GoogleSignInButton';

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
  ReactDOM.render(<Provider store={store}><GoogleSignInButton /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
