import { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
} from 'store/slices/gameStateSlice';

const useGameWebsocket = (gameId, userInfo) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const gameInfo = useSelector(state => state.gameState.gameInfo);
    const [connectedPlayers, setConnectedPlayers] = useState([]);
    const gameStateRef = useRef(gameInfo);

    useEffect(() => {
        gameStateRef.current = gameInfo;
    }, [gameInfo]);

    const handleWebSocketMessage = useCallback((message) => {
        const data = JSON.parse(message);
        console.log('Received WebSocket message:', data);

        switch (data.type) {
            case "GAME_OVER":
                dispatch(setGameOver(true));
                dispatch(setWinner(data.winner));
                dispatch(setGameInfo({ ...gameStateRef.current, state: "5", winner: data.winner }));
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
            case "REMATCH_CANCELLED":
                console.log(`Rematch ${data.type.toLowerCase()}:`, data);
                toast.info(`Rematch ${data.type.toLowerCase()}`);
                dispatch(setRematchRequested({ requested: false, requestedBy: null }));
                break;
            default:
                console.log('Unhandled message type:', data.type);
        }
    }, [dispatch, navigate, userInfo]);

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

            const fetchPlayerInfo = async (playerId) => {
                const playerResponse = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${playerId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: playerId })
                });
                if (!playerResponse.ok) {
                    throw new Error(`Failed to fetch player ${playerId} information`);
                }
                return playerResponse.json();
            };

            const [player1Data, player2Data] = await Promise.all([
                fetchPlayerInfo(data.player1_id),
                fetchPlayerInfo(data.player2_id)
            ]);

            dispatch(setPlayerOne(player1Data));
            dispatch(setPlayerTwo(player2Data));

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

    const getWinnerUsername = useCallback(async (winnerId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${winnerId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
