import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useWebSocket from './useWebsocket';
import { 
  setGameInfo, 
  setPlayerOne, 
  setPlayerTwo, 
  setGameOver,
  setWinner,
  setWinnerPaid,
  setRematchRequested
} from '../../store/slices/gameStateSlice';

const useGameWebsocket = (gameId, userInfo, dispatch) => {
    const [connectedPlayers, setConnectedPlayers] = useState([]);
    const navigate = useNavigate();
    const gameInfo = useSelector(state => state.gameState.gameInfo);

    const handleWebSocketMessage = useCallback((message) => {
        const data = JSON.parse(message);
        console.log('Received WebSocket message:', data);
        switch (data.type) {
            case "GAME_OVER":
                dispatch(setGameOver(true));
                dispatch(setWinner(data.winner));
                dispatch(setGameInfo({ ...gameInfo, state: "5", winner: data.winner }));
                break;
            case "PLAYER_CONNECTED":
            case "PLAYER_DISCONNECTED":
            case "GAME_UPDATED":
                handleFetchGameInfo();
                break;
            case "REMATCH_REQUESTED":
                dispatch(setRematchRequested({ requested: true, requestedBy: data.from }));
                toast.info(`Rematch requested by ${data.from === userInfo?.user_id ? 'you' : 'opponent'}`);
                break;
            case "CONTRACT_READY":
                console.log("Game contract ready:", data);
                navigate(`/game-pending/${data.gameId}`);
                dispatch(setRematchRequested({ requested: false, requestedBy: null }));
                break;
            case "REMATCH_ACCEPTED":
                console.log("Rematch accepted:", data);
                toast.success("Rematch accepted! Preparing new game...");
                break;
            case "REMATCH_REJECTED":
                console.log("Rematch rejected:", data);
                toast.error("Rematch rejected!");
                dispatch(setRematchRequested({ requested: false, requestedBy: null }));
                break;
            case "REMATCH_CANCELLED":
                console.log("Rematch cancelled:", data);
                toast.success("Rematch cancelled!");
                dispatch(setRematchRequested({ requested: false, requestedBy: null }));
                break;
            default:
                console.log('Unhandled message type:', data.type);
        }
    }, [dispatch, navigate, userInfo, gameInfo]);

    const { socket } = useWebSocket(
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
            dispatch(setGameInfo(data));

            if (data.player1_id) {
                handleFetchPlayerInfo(data.player1_id, setPlayerOne);
            }

            if (data.player2_id) {
                handleFetchPlayerInfo(data.player2_id, setPlayerTwo);
            }

            if (data.state === "5") {
                dispatch(setGameOver(true));
                const winnerUsername = data.winner ? await getWinnerUsername(data.winner) : 'Draw';
                dispatch(setWinner(winnerUsername));
                dispatch(setWinnerPaid(true));
                dispatch(setGameInfo({ ...data, winnerUsername }));
            }

        } catch (error) {
            console.error('Error fetching game information:', error);
            toast.error('Error fetching game information');
        }
    }, [gameId, dispatch]);

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
            dispatch(setPlayerInfo(data));
        } catch (error) {
            console.error('Error fetching player information:', error);
            toast.error('Error fetching player information');
        }
    }, [dispatch]);

    const getWinnerUsername = useCallback(async (winnerId) => {
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
    }, []);

    useEffect(() => {
        if (gameId) {
            handleFetchGameInfo();
            const intervalId = setInterval(handleFetchGameInfo, 30000);
            return () => clearInterval(intervalId);
        }
    }, [gameId, handleFetchGameInfo]);

    return {
        handleFetchGameInfo,
        connectedPlayers,
    };
};

export default useGameWebsocket;
