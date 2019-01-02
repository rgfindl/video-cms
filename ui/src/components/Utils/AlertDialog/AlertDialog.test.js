import React from 'react';
import ReactDOM from 'react-dom';
import AlertDialog from './AlertDialog';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AlertDialog 
    open={false} 
    title='Request failed'
    description='Login failed, please try again.'
    handlePositive={() => {}}
    handleClose={() => {}}
    positiveButton='Close' />, div);
  ReactDOM.unmountComponentAtNode(div);
});
