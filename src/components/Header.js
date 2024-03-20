import React from 'react';
import { Link } from 'react-router-dom';
import useWallet from '../hooks/useWallet';

const Header = () => {
    const { walletAddress, connectAccount } = useWallet();
    
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
                    {walletAddress && (
                        <p>
                            Connected Wallet Address: <strong>{walletAddress}</strong>
                        </p>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
