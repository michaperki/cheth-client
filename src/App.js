import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header, NavigationRoutes } from 'components';
import { useWebSocket, useWallet, useDarkMode, useFetchUser } from './hooks';
import { EthereumPriceProvider } from './contexts/EthereumPriceContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createAppTheme from './theme/createAppTheme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { walletAddress, connectAccount } = useWallet();
  const userInfo = useSelector(state => state.user.userInfo);

  // Use the refactored hook
  useFetchUser();

  const theme = createAppTheme(darkMode);
  const isAdmin = userInfo && userInfo.user_role === 'admin';

  const handleWebSocketMessage = useCallback((message) => {
    console.log('Received message in App:', message);
  }, []);

  const { onlineUsersCount } = useWebSocket(handleWebSocketMessage, userInfo?.userId, ['ONLINE_USERS_COUNT']);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <EthereumPriceProvider>
          <CssBaseline />
          <Header 
            userInfo={userInfo} 
            toggleDarkMode={toggleDarkMode} 
            darkMode={darkMode} 
            isAdmin={isAdmin}
            walletAddress={walletAddress}
            connectAccount={connectAccount}
          />
          <div className="app-container">
            <NavigationRoutes userInfo={userInfo} onlineUsersCount={onlineUsersCount} isAdmin={isAdmin} />
          </div>
          <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </EthereumPriceProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
