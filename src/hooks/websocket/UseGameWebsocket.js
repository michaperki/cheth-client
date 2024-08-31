import { useState, useCallback, useEffect } from 'react';
import useWebSocket from './useWebsocket';

const useGameWebsocket = (gameId, userInfo) => {
    const [gameInfo, setGameInfo] = useState(null);
    const [playerOne, setPlayerOne] = useState(null);
    const [playerTwo, setPlayerTwo] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState('');
    const [winnerPaid, setWinnerPaid] = useState(false);
    const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '' });

    const handleWebSocketMessage = useCallback((message) => {
        const data = JSON.parse(message);
        console.log('Received WebSocket message:', data);
        switch (data.type) {
            case "GAME_OVER":
                setGameOver(true);
                setWinner(data.winner);
                break;
            case "PLAYER_CONNECTED":
            case "PLAYER_DISCONNECTED":
                // Trigger a re-fetch of game info when players connect/disconnect
                handleFetchGameInfo();
                break;
            case "GAME_UPDATED":
                // Trigger a re-fetch of game info when the game state is updated
                handleFetchGameInfo();
                break;
            default:
                console.log('Unhandled message type:', data.type);
        }
    }, []);

    const { socket, connectedPlayers } = useWebSocket(
        handleWebSocketMessage,
        userInfo?.user_id,
        ['ONLINE_USERS_COUNT']
    );

    const handleFetchGameInfo = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/${gameId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch game information');
            }
            const data = await response.json();
            setGameInfo(data);

            if (data.player1_id) {
                handleFetchPlayerInfo(data.player1_id, setPlayerOne);
            }

            if (data.player2_id) {
                handleFetchPlayerInfo(data.player2_id, setPlayerTwo);
            }

            console.log("Game data in useGameWebsocket hook:", data);

            // Check if the game is over
            if (data.state === "5") {
                setGameOver(true);
                setWinner(data.winner ? await getWinnerUsername(data.winner) : 'Draw');
                setWinnerPaid(true);
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

    const getWinnerUsername = async (winnerId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${winnerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: winnerId })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch winner information');
            }
            const data = await response.json();
            return data.username;
        } catch (error) {
            console.error('Error fetching winner information:', error);
            return 'Unknown';
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarInfo({ ...snackbarInfo, open: false });
    };

    useEffect(() => {
        handleFetchGameInfo();

        // Set up an interval to fetch game info every 30 seconds
        const intervalId = setInterval(handleFetchGameInfo, 30000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [handleFetchGameInfo]);

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
        handleCloseSnackbar,
        connectedPlayers
    };
};

export default useGameWebsocket;
