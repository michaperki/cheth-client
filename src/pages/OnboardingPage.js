import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet'; // Changed import statement

const Onboarding = () => {
    const { lichessUsername } = useParams(); // Get the username from URL parameters
    const [darkMode, setDarkMode] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const { walletAddress, connectAccount } = useWallet();

    // Remove the setUsername function

    const submitUserInfo = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/addUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lichessHandle: lichessUsername, // Use the lichessUsername from URL parameters
                    walletAddress,
                    darkMode,
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.warn('Failed to submit user info:', err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        submitUserInfo();
    };

    return (
        <div>
            <h1>Welcome {lichessUsername}</h1>
            {!walletAddress && (
                <button onClick={connectAccount} disabled={submitted}>
                    Connect Wallet
                </button>
            )}
            {walletAddress && (
                <p>
                    Connected Wallet Address: <strong>{walletAddress}</strong>
                </p>
            )}
            {walletAddress && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Dark Mode Preference:</label>
                        <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            id="terms"
                        />
                        <label htmlFor="terms">I accept the terms and conditions</label>
                    </div>
                    <button type="submit" disabled={!acceptedTerms || submitted}>
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default Onboarding;
