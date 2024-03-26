import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet'; // Changed import statement
import { FormControlLabel, Checkbox, Button, Typography } from '@mui/material'; // Import MUI components
import { useTheme } from '@mui/material/styles'; // Import useTheme hook

const Onboarding = () => {
    const { lichessUsername } = useParams(); // Get the username from URL parameters
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const theme = useTheme(); // Get the current theme

    const { walletAddress, connectAccount } = useWallet();

    const submitUserInfo = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/addUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lichessHandle: lichessUsername, // Use the lichessUsername from URL parameters
                    walletAddress,
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
        <div className={`min-h-screen flex justify-center items-center ${theme.palette.mode === 'dark' ? 'dark-mode' : ''}`}>
            <div>
                <Typography variant="h3" gutterBottom>Welcome {lichessUsername}</Typography>
                {!walletAddress && (
                    <Button variant="contained" onClick={connectAccount} disabled={submitted}>Connect Wallet</Button>
                )}
                {walletAddress && (
                    <Typography variant="body1" gutterBottom>
                        Connected Wallet Address: <strong>{walletAddress}</strong>
                    </Typography>
                )}
                {walletAddress && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormControlLabel
                            control={<Checkbox checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />}
                            label="I accept the terms and conditions"
                        />
                        <Button type="submit" variant="contained" disabled={!acceptedTerms || submitted}>Submit</Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
