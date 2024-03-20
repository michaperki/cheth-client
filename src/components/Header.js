import React from 'react';
import { Link } from 'react-router-dom';
import useWallet from '../hooks/useWallet';

const Header = ({ username }) => {
    const { walletAddress, connectAccount } = useWallet();

    // Abbreviate wallet address
    const abbreviatedWalletAddress = walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : '';

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
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
