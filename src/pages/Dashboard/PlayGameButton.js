import React from 'react';
import { Button, Typography } from '@mui/material';

const PlayGameButton = ({ playGame, amount, ethereumAmount, theme }) => {
    return (
        <div>

            <Button
                onClick={playGame}
                variant="contained"
                color="primary"
                sx={{
                    mt: 4, // Add margin to the top of the button
                    borderRadius: '10px', // Make the button more square
                    width: '200px', // Adjust the width of the button
                    height: '200px', // Adjust the height of the button to make it more square
                    padding: '20px', // Add padding to the button
                    display: 'flex', // Make the button a flex container
                    flexDirection: 'column', // Align items vertically
                    justifyContent: 'space-between', // Add space between items
                    '&:hover': { 
                        transform: 'scale(1.05)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        bgcolor: 'primary.dark',
                    }
                }}
            >
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Play a game for...
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 
                    'bold',
                     }}>
                    ${amount}
                </Typography>
                <Typography
                    sx={{
                        fontSize: '0.8rem',
                        color: theme.palette.mode === 'dark' ? '#2b8a3e' : '#4caf50',
                    }}
                >
                    {ethereumAmount} ETH
                </Typography>
            </Button>
        </div>
    );
};

export default PlayGameButton;
