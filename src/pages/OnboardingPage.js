import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormControlLabel, Checkbox, Button, Typography, CircularProgress, Box, useTheme } from '@mui/material';
import { useWallet, useSubmitUserInfo } from 'hooks';
import { login } from '../services/authService';
import { toast } from 'react-toastify';

const Onboarding = () => {
    const { lichessUsername } = useParams();
    const navigate = useNavigate();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const { walletAddress, connectAccount, signMessage } = useWallet();
    const { submit, submitted } = useSubmitUserInfo(lichessUsername, walletAddress);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (!lichessUsername) {
            toast.error('Lichess username is missing');
            navigate('/');
        }
    }, [lichessUsername, navigate]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!walletAddress) {
            toast.error('Wallet not connected');
            return;
        }
        if (!acceptedTerms) {
            toast.error('Please accept the terms and conditions');
            return;
        }
        setIsLoading(true);
        try {
            const message = "Login to VirtualLabs";
            const signature = await signMessage(message);
            await login(walletAddress, message, signature);
            await submit();
        } catch (error) {
            console.error('Onboarding failed:', error);
            toast.error('Onboarding failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [walletAddress, signMessage, submit, acceptedTerms]);

    if (isLoading) {
        return (
            <OnboardingLayout>
                <CircularProgress />
                <Typography>Processing your information...</Typography>
            </OnboardingLayout>
        );
    }

    return (
        <OnboardingLayout>
            <Typography variant="h3" gutterBottom>Welcome {lichessUsername}</Typography>
            <WalletConnectionSection walletAddress={walletAddress} connectAccount={connectAccount} submitted={submitted} />
            <TermsAndSubmitSection acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} handleSubmit={handleSubmit} submitted={submitted} />
        </OnboardingLayout>
    );
};

const OnboardingLayout = ({ children }) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
            }}
        >
            <Box
                sx={{
                    p: 4,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[3],
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

const WalletConnectionSection = ({ walletAddress, connectAccount, submitted }) => (
    <Box sx={{ mb: 2 }}>
        {!walletAddress && (
            <Button variant="contained" onClick={connectAccount} disabled={submitted}>Connect Wallet</Button>
        )}
        {walletAddress && (
            <Typography variant="body1" gutterBottom>
                Connected Wallet Address: <strong>{walletAddress}</strong>
            </Typography>
        )}
    </Box>
);

const TermsAndSubmitSection = ({ acceptedTerms, setAcceptedTerms, handleSubmit, submitted }) => (
    <form onSubmit={handleSubmit}>
        <FormControlLabel
            control={<Checkbox checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />}
            label="I accept the terms and conditions"
        />
        <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" disabled={!acceptedTerms || submitted} fullWidth>
                {submitted ? 'Processing...' : 'Submit'}
            </Button>
        </Box>
    </form>
);

export default Onboarding;
