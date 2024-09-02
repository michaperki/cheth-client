import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useWebSocket from './useWebsocket';
import { 
  setCurrentGame, 
  setPlayerOne, 
  setPlayerTwo, 
  setConnectedPlayers 
} from '../../store/slices/gameSlice';

const useGameWebsocket = (gameId, userInfo) => {
    const dispatch = useDispatch();
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

    const navigate = useNavigate();

    const handleWebSocketMessage = useCallback((message) => {
        const data = JSON.parse(message);
        console.log('Received WebSocket message:', data);
        switch (data.type) {
            case "GAME_OVER":
                setGameOver(true);
                setWinner(data.winner);
                dispatch(setCurrentGame({ ...gameInfo, state: "5", winner: data.winner }));
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
            case "CONTRACT_READY":
                console.log("Game contract ready:", data);
                navigate(`/game-pending/${data.gameId}`);
                resetRematchState();
                break;
            case "REMATCH_ACCEPTED":
                console.log("Rematch accepted:", data);
                toast.success("Rematch accepted! Preparing new game...");
                break;
            case "REMATCH_REJECTED":
                console.log("Rematch rejected:", data);
                toast.error("Rematch rejected!");
                resetRematchState();
                break;
            case "REMATCH_CANCELLED":
                console.log("Rematch cancelled:", data);
                toast.success("Rematch cancelled!");
                resetRematchState();
                break;
            default:
                console.log('Unhandled message type:', data.type);
        }
    }, [userInfo, navigate, gameInfo, dispatch]);

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
            dispatch(setCurrentGame(data));

            if (data.player1_id) {
                handleFetchPlayerInfo(data.player1_id, setPlayerOne);
            }

            if (data.player2_id) {
                handleFetchPlayerInfo(data.player2_id, setPlayerTwo);
            }

            if (data.state === "5") {
                setGameOver(true);
                const winnerUsername = data.winner ? await getWinnerUsername(data.winner) : 'Draw';
                setWinner(winnerUsername);
                setWinnerPaid(true);
                dispatch(setCurrentGame({ ...data, winnerUsername }));
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
            setPlayerInfo(data);
            if (playerId === gameInfo?.player1_id) {
                dispatch(setPlayerOne(data));
            } else if (playerId === gameInfo?.player2_id) {
                dispatch(setPlayerTwo(data));
            }
        } catch (error) {
            console.error('Error fetching player information:', error);
            toast.error('Error fetching player information');
        }
    }, [dispatch, gameInfo]);

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

    const resetRematchState = useCallback(() => {
        setRematchRequested(false);
        setRematchRequestedBy(null);
        setRematchWagerSize(null);
        setRematchTimeControl(null);
    }, []);

    useEffect(() => {
        if (gameId) {
            handleFetchGameInfo();
            const intervalId = setInterval(handleFetchGameInfo, 30000);
            return () => clearInterval(intervalId);
        }
    }, [gameId, handleFetchGameInfo]);

    useEffect(() => {
        dispatch(setConnectedPlayers(connectedPlayers));
    }, [connectedPlayers, dispatch]);

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
        resetRematchState
    };
};

export default useGameWebsocket;
