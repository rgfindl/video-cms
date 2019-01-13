import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './store';
import './index.css';
import App from './components/App/App';
import { unregister } from './serviceWorker';

const rootElement = document.getElementById('root');
const initialState = {
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
}
const store = configureStore(initialState);
if (rootElement.hasChildNodes()) {
  hydrate(
    <Provider store={store}>
      <App />
    </Provider>, rootElement);
} else {
  render(
    <Provider store={store}>
      <App />
    </Provider>, rootElement);
}
unregister();
