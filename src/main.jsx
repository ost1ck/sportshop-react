// src/main.jsx (або index.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppProviders from './context/AppProviders';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProviders>
    <App />
  </AppProviders>
);