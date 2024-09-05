import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FormControlLabel, Checkbox, Button, Typography } from '@mui/material';
import { useWallet, useSubmitUserInfo } from 'hooks';

const Onboarding = () => {
    const { lichessUsername } = useParams();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const { walletAddress, connectAccount } = useWallet();
    const { submit, submitted } = useSubmitUserInfo(lichessUsername, walletAddress);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        submit();
    }, [submit]);

    return (
        <OnboardingLayout>
            <Typography variant="h3" gutterBottom>Welcome {lichessUsername}</Typography>
            <WalletConnectionSection walletAddress={walletAddress} connectAccount={connectAccount} submitted={submitted} />
            <TermsAndSubmitSection acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} handleSubmit={handleSubmit} submitted={submitted} />
        </OnboardingLayout>
    );
};

const OnboardingLayout = ({ children }) => (
    <div className="min-h-screen flex justify-center items-center">
        <div>{children}</div>
    </div>
);

const WalletConnectionSection = ({ walletAddress, connectAccount, submitted }) => (
    <>
        {!walletAddress && (
            <Button variant="contained" onClick={connectAccount} disabled={submitted}>Connect Wallet</Button>
        )}
        {walletAddress && (
            <Typography variant="body1" gutterBottom>
                Connected Wallet Address: <strong>{walletAddress}</strong>
            </Typography>
        )}
    </>
);

const TermsAndSubmitSection = ({ acceptedTerms, setAcceptedTerms, handleSubmit, submitted }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
        <FormControlLabel
            control={<Checkbox checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />}
            label="I accept the terms and conditions"
        />
        <Button type="submit" variant="contained" disabled={!acceptedTerms || submitted}>Submit</Button>
    </form>
);

export default Onboarding;
