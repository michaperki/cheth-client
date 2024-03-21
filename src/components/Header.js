import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Header = ({ userId, username, darkMode, setDarkMode }) => {
    const { walletAddress, connectAccount } = useWallet();
    const abbreviatedWalletAddress = walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : '';

    const toggleDarkMode = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/toggleDarkMode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            const data = await response.json();
            console.log(data);
            setDarkMode(!darkMode);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <header className="bg-gray-800 text-white py-4">
            <nav className="container mx-auto flex justify-between items-center">
                <ul className="flex">
                    <li className="mr-6">
                        <Link to="/" className="hover:text-gray-300">Home</Link>
                    </li>
                </ul>
                <div>
                    {!walletAddress && (
                        <button onClick={connectAccount} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Connect Wallet
                        </button>
                    )}
                    {username && walletAddress && (
                        <div className="flex items-center">
                            <strong className="mr-2">{username}</strong>
                            {`(${abbreviatedWalletAddress})`}
                            <button onClick={toggleDarkMode} className="ml-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
