import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const renderApp = () =>
  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );

renderApp();
