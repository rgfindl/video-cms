import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import App from './components/App/App';
import { unregister } from './serviceWorker';

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
unregister();
