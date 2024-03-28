import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MetaMaskProvider } from "@metamask/sdk-react";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MetaMaskProvider
      debug={true}
      sdkOptions={{
        dappMetadata: {
          name: 'Chess Game',
          url: window.location.href,
        },
        INFURA_API_KEY: process.env.INFURA_API_KEY,
      }}

    >
      <App />
    </MetaMaskProvider>
  </React.StrictMode>
);