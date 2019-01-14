import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux'
import configureStore from '../../../store';
import Video from './Video';

it('renders without crashing', () => {
  const store = configureStore({
    display: {
      drawerOpen: false,
      inProgress: false,
      alertOpen: false,
      error: ''
    },
    videoForm: {
      deleteProgress: false,
      saveProgress: false,
      uploadProgress: false,
      saveComplete: false,
      deleteComplete: false,
      deleteConfirmation: false,
      formErrors: {
        title: '', 
        description: '', 
        url: ''
      },
      titleValid: false,
      titleChanged: false,
      descriptionValid: false,
      descriptionChanged: false,
      urlValid: false,
      urlChanged: false,
      formValid: false,
      video: {
        title: '',
        description: '',
        url: ''
      }
    }
  });
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><Router><Video /></Router></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
