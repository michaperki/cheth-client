import React from 'react';
import { Link } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import RefreshIcon from '@mui/icons-material/Refresh';
import UserIcon from '@mui/icons-material/PeopleAlt';
import Typography from '@mui/material/Typography';

const Header = ({ userInfo, toggleDarkMode, darkMode, refreshWebSocket, onlineUsersCount }) => {
    const { walletAddress, connectAccount } = useWallet();
    const abbreviatedWalletAddress = walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : '';

    return (
        <header className="bg-gray-800 text-white py-4">
            <nav className="container mx-auto flex justify-between items-center">
                <ul className="flex">
                    <li className="mr-6">
                        <Link to="/" className="hover:text-gray-300">Home</Link>
                    </li>
                    <li className="mr-6">
                        <Link to="/admin" className="hover:text-gray-300">Admin</Link>
                    </li>
                </ul>
                {onlineUsersCount !== null && (
                    <div>
                        <Typography variant="body2" component="span" className="mr-2">
                            {onlineUsersCount}
                        </Typography>
                        <UserIcon 
                            className="ml-2"
                            sx={{ fontSize: 20 }}
                        />                        
                    </div>
                )}
                <div>
                    {!walletAddress && (
                        <button onClick={connectAccount} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Connect Wallet
                        </button>
                    )}
                    {userInfo && (
                        <div className="flex items-center">
                            <strong className="mr-2">{userInfo.username}</strong>
                            {`(${abbreviatedWalletAddress})`}
                            <IconButton onClick={toggleDarkMode} color="inherit">
                                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                            <IconButton onClick={refreshWebSocket} color="inherit">
                                <RefreshIcon />
                            </IconButton>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
