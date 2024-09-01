import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import useWebSocket from './useWebsocket';

const useGameWebsocket = (gameId, userInfo) => {
    const [gameInfo, setGameInfo] = useState(null);
    const [playerOne, setPlayerOne] = useState(null);
    const [playerTwo, setPlayerTwo] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState('');
    const [winnerPaid, setWinnerPaid] = useState(false);
    const [rematchRequested, setRematchRequested] = useState(false);
    const [rematchRequestedBy, setRematchRequestedBy] = useState(null);
    const [rematchWagerSize, setRematchWagerSize] = useState(null);
    const [rematchTimeControl, setRematchTimeControl] = useState(null);

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
            case "GAME_UPDATED":
                handleFetchGameInfo();
                break;
            case "REMATCH_REQUESTED":
                setRematchRequested(true);
                setRematchRequestedBy(data.from);
                setRematchWagerSize(data.wagerSize);
                setRematchTimeControl(data.timeControl);
                toast.info(`Rematch requested by ${data.from === userInfo?.user_id ? 'you' : 'opponent'}`);
                break;
            default:
                console.log('Unhandled message type:', data.type);
        }
    }, [userInfo]);

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

            if (data.state === "5") {
                setGameOver(true);
                setWinner(data.winner ? await getWinnerUsername(data.winner) : 'Draw');
                setWinnerPaid(true);
            }

        } catch (error) {
            console.error('Error fetching game information:', error);
            toast.error('Error fetching game information');
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
            toast.error('Error fetching player information');
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
            toast.error('Error fetching winner information');
            return 'Unknown';
        }
    };

    useEffect(() => {
        if (gameId) {
            handleFetchGameInfo();
            const intervalId = setInterval(handleFetchGameInfo, 30000);
            return () => clearInterval(intervalId);
        }
    }, [gameId, handleFetchGameInfo]);

    return {
        gameInfo,
        playerOne,
        playerTwo,
        gameOver,
        winner,
        winnerPaid,
        handleFetchGameInfo,
        connectedPlayers,
        rematchRequested,
        rematchRequestedBy,
        rematchWagerSize,
        rematchTimeControl,
        resetRematchState: () => {
            setRematchRequested(false);
            setRematchRequestedBy(null);
            setRematchWagerSize(null);
            setRematchTimeControl(null);
        }
    };
};

export default useGameWebsocket;
