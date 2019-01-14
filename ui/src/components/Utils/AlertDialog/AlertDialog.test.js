import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from '../../../store';
import AlertDialog from './AlertDialog';

it('renders without crashing', () => {
  const store = configureStore({});
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><AlertDialog 
    open={false} 
    title='Request failed'
    description='Login failed, please try again.'
    handlePositive={() => {}}
    handleClose={() => {}}
    positiveButton='Close' /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
