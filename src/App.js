import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header, NavigationRoutes } from 'components';
import { useWebSocket, useWallet, useDarkMode, useFetchUser } from './hooks';
import { EthereumPriceProvider } from 'contexts/EthereumPriceContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createAppTheme from 'theme/createAppTheme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const MemoizedHeader = React.memo(Header);
const MemoizedNavigationRoutes = React.memo(NavigationRoutes);

function AuthProvider({ children }) {
  useFetchUser();
  return children;
}
function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { walletAddress, connectAccount } = useWallet();
  const userInfo = useSelector(state => state.user.userInfo);
  const theme = useMemo(() => createAppTheme(darkMode), [darkMode]);
  const isAdmin = useMemo(() => userInfo && userInfo.user_role === 'admin', [userInfo]);

  const handleWebSocketMessage = useCallback((message) => {
    console.log('Received message in App:', message);
  }, []);

  const { onlineUsersCount } = useWebSocket(handleWebSocketMessage, userInfo?.userId, ['ONLINE_USERS_COUNT']);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <EthereumPriceProvider>
            <CssBaseline />
            <MemoizedHeader 
              userInfo={userInfo} 
              toggleDarkMode={toggleDarkMode} 
              darkMode={darkMode} 
              isAdmin={isAdmin}
              walletAddress={walletAddress}
              connectAccount={connectAccount}
            />
            <div className="app-container">
              <MemoizedNavigationRoutes userInfo={userInfo} onlineUsersCount={onlineUsersCount} isAdmin={isAdmin} />
            </div>
            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          </EthereumPriceProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
