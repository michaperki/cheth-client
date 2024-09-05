import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { MetaMaskProvider } from "@metamask/sdk-react";
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <MetaMaskProvider
      debug={false}
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
  </Provider>
);
