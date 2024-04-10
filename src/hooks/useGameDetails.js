import { useState, useCallback } from 'react';
import Web3 from 'web3';

const useGameDetails = (gameId, userInfo) => {
    const [gameInfo, setGameInfo] = useState(null);
    const [playerOne, setPlayerOne] = useState(null);
    const [playerTwo, setPlayerTwo] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState('');
    const [winnerPaid, setWinnerPaid] = useState(false);
    const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '' });

    const handleFetchGameInfo = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/${gameId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch game information');
            }
            const data = await response.json();
            setGameInfo(data);
            // Additional logic to set game state can be added here

            if (data.player1_id) {
                handleFetchPlayerInfo(data.player1_id, setPlayerOne);
            }

            if (data.player2_id) {
                handleFetchPlayerInfo(data.player2_id, setPlayerTwo);
            }

        } catch (error) {
            console.error('Error fetching game information:', error);
        }
    }, [gameId]);

    const handleFetchPlayerInfo = useCallback(async (playerId, setPlayerInfo) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${playerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: playerId })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch player information');
            }
            const data = await response.json();
            setPlayerInfo(data);
        } catch (error) {
            console.error('Error fetching player information:', error);
        }
    }, []);

    const handleCloseSnackbar = () => {
        setSnackbarInfo({ ...snackbarInfo, open: false });
    };

    // Further functionalities like handling websocket messages can be added here

    return {
        gameInfo,
        playerOne,
        playerTwo,
        gameOver,
        winner,
        winnerPaid,
        handleFetchGameInfo,
        snackbarInfo,
        setSnackbarInfo: (message) => setSnackbarInfo({ open: true, message }),
        handleCloseSnackbar
    };
};

export default useGameDetails;
