import React from 'react';
import { Button, Typography, useTheme } from '@mui/material';

const PlayGameButton = ({ playGame, amount, ethereumAmount }) => {
    const theme = useTheme(); // Get the theme from MUI

    // Styles for the button
    const buttonStyles = {
        mt: 4,
        borderRadius: 2, // Less rounded corners
        width: 250, // Wider for better readability
        height: 'auto', // Auto height for better content fitting
        padding: theme.spacing(2), // Consistent padding
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center align the content
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
        '&:hover': {
            transform: 'scale(1.03)',
            transition: 'transform 0.3s ease-in-out',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            bgcolor: theme.palette.primary.dark,
        },
        background: theme.palette.primary.main, // Consistent with primary color
        color: theme.palette.primary.contrastText, // Text color that contrasts with the button
    };

    return (
        <Button onClick={playGame} variant="contained" sx={buttonStyles}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Play a game for...
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                ${amount}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.grey[500], mt: 1 }}>
                {ethereumAmount} ETH
            </Typography>
        </Button>
    );
};

export default PlayGameButton;
