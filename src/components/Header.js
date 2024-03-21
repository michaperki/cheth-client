import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useWallet from '../hooks/useWallet';

const Header = ({ userId, username, darkMode, setDarkMode }) => { // Receive dark mode state and setter as props
    const { walletAddress, connectAccount } = useWallet();

    // Abbreviate wallet address
    const abbreviatedWalletAddress = walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : '';

    // Function to toggle dark mode
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
            // Update the state to reflect the change in UI
            setDarkMode(!darkMode); // Toggle dark mode state
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
                            {/* Dark mode toggle button */}
                            <button onClick={toggleDarkMode} className="ml-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
