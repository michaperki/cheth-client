import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MetaMaskProvider } from "@metamask/sdk-react";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MetaMaskProvider>
      <App />
    </MetaMaskProvider>
  </React.StrictMode>
);