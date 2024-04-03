import React from 'react';
import { Link } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import './Header.css';

const Header = ({ userInfo, toggleDarkMode, darkMode }) => {
    const { walletAddress, connectAccount } = useWallet();
    const abbreviatedWalletAddress = walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : '';

    return (
        <header className="header">
            <nav className="container mx-auto flex justify-between items-center">
                <ul className="menu">
                    <li className="menu-item">
                        <Link to="/" className="menu-link">Home</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/admin" className="menu-link">Admin</Link>
                    </li>
                </ul>

                <div>
                    {!walletAddress && (
                        <button onClick={connectAccount} className="connect-button">
                            Connect Wallet
                        </button>
                    )}
                    {walletAddress && userInfo && (
                        <div className="user-info">
                            <Link to="/account" className="username">
                                <strong>{userInfo.username}</strong>
                            </Link>
                            <span className="wallet-address">({abbreviatedWalletAddress})</span>
                            <IconButton onClick={toggleDarkMode} color="inherit">
                                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
