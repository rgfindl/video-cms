import React from 'react';
import ReactDOM from 'react-dom';
import GoogleSignInButton from './GoogleSignInButton';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GoogleSignInButton />, div);
  ReactDOM.unmountComponentAtNode(div);
});
