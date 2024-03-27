import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import { Button, Typography, Snackbar } from '@mui/material'; // Import MUI components
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import { useEthereumPrice } from '../contexts/EthereumPriceContext'; // Import Ethereum price context
import NumberDisplay from '../components/game/NumberDisplay';
import useGame from '../hooks/useGame';
import web3 from 'web3'; // Import web3 here

const GamePendingPage = () => {
    const { gameId } = useParams();
    const { walletAddress, connectAccount } = useWallet();


    const getGameInfo = async (gameId) => {
        try {
            console.log('Getting game info for game ID:', gameId);
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getGame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameId })
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const { gameInfo, joinGame, cancelGame, hasPlayerJoined, snackbarOpen, snackbarMessage, handleSnackbarClose, handleWebSocketMessage } = useGame(gameId, getGameInfo);
    const ethToUsdRate = useEthereumPrice(); // Fetch Ethereum to USD exchange rate
    const theme = useTheme(); // Get the current theme
    const navigate = useNavigate();

    return (
        <div className={`max-w-md w-full p-8 bg-${theme.palette.mode === 'dark' ? 'black' : 'white'} rounded shadow-lg`}>
            <Typography variant="h3" sx={{ mb: 4 }}>Game Pending</Typography>
            {gameInfo && (parseInt(gameInfo.state) === 2 || parseInt(gameInfo.state) === 3) && (
                <div>
                    <Typography sx={{ mb: 2 }}>Game ID: {gameInfo.game_id}</Typography>

                    <Typography sx={{ mb: 2 }}>Contract Balance
                        <NumberDisplay amount={web3.utils.fromWei(gameInfo.reward_pool, 'ether')} currency="ETH" />
                    </Typography>

                    <Typography sx={{ mb: 2 }}>Players: {gameInfo.player1_id} vs {gameInfo.player2_id}</Typography>
                    <Button
                        onClick={joinGame}
                       
                        variant="contained"
                        color="primary"
                        sx={{ '&:hover': { bgcolor: 'primary.dark' }, mr: 2 }}
                        disabled={hasPlayerJoined} // Disable the button if the player has already joined
                    >
                        Join Game
                    </Button>
                    <Button
                        onClick={cancelGame}
                        variant="contained"
                        color="error"
                        sx={{ '&:hover': { bgcolor: 'error.dark' } }}
                    >
                        Cancel Game
                    </Button>
                </div>
            )}
            {gameInfo && parseInt(gameInfo.state) === -1 && (
                <Typography sx={{ mb: 2 }}>Game has been cancelled.</Typography>
            )}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
}

export default GamePendingPage;
