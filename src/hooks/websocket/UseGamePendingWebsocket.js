import { useMemo, useState, useEffect } from 'react';
import useWebSocket from './useWebsocket';
import { useNavigate } from 'react-router-dom';

const UseGamePendingWebsocket = (gameId, userInfo) => {
    const [hasPlayerJoined, setHasPlayerJoined] = useState(false);
    const [gameInfo, setGameInfo] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [ownerAddress, setOwnerAddress] = useState(null);
    const [contractBalance, setContractBalance] = useState(0);
    const [player_one, setPlayerOne] = useState(null);
    const [player_two, setPlayerTwo] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [connectedPlayers, setConnectedPlayers] = useState([]);
    const [readyPlayers, setReadyPlayers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        console.log('connectedPlayers updated:', connectedPlayers);
    }, [connectedPlayers]);

    useEffect(() => {
        console.log('readyPlayers updated:', readyPlayers);
    }, [readyPlayers]);

    const getGameInfo = async () => {
        try {
            console.log('Fetching game info inside UseGamePendingWebsocket...');
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/${gameId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch game information');
            }
            const gameData = await response.json();
            console.log('Game data:', gameData);
            setGameInfo(gameData);
            setGameState(gameData.state);

            const fetchPlayerData = async (playerId) => {
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
                fetchPlayerData(gameData.player1_id),
                fetchPlayerData(gameData.player2_id)
            ]);

            setPlayerOne(player1Data);
            setPlayerTwo(player2Data);

            if (gameData && [2, 3].includes(parseInt(gameData.state))) {
                setContractAddress(gameData.contract_address);
                setOwnerAddress(gameData.game_creator_address);
                setContractBalance(gameData.reward_pool);
            }

            if (gameData && parseInt(gameData.state) === 4) {
                console.log('Game is primed. Navigating to game page...');
                navigate(`/game/${gameId}`);
            }
        } catch (error) {
            console.error('Error fetching game status:', error);
        }
    };

    const handleGamePendingPageWebSocketMessage = (message) => {
        console.log('Received message in GamePendingWebsocket:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);

        switch (messageData.type) {
            case "GAME_JOINED":
                console.log("Switch case: GAME_JOINED");
                console.log("messageData: ", messageData);
                console.log("readyPlayers: ", readyPlayers);
                const newPlayerWallet = messageData.player;
                const hasJoined = newPlayerWallet === userInfo.wallet_address;
                setHasPlayerJoined(hasJoined);
                setReadyPlayers(prev => {
                    const newReadyPlayers = [...prev, messageData.userId];
                    console.log("newReadyPlayers: ", newReadyPlayers);
                    return newReadyPlayers;
                });
                break;
            case "GAME_PRIMED":
                console.log("Switch case: GAME_PRIMED");
                navigate(`/game/${gameId}`);
                break;
            case "PLAYER_CONNECTED":
                console.log("Switch case: PLAYER_CONNECTED");
                console.log("Current connectedPlayers:", connectedPlayers);
                setConnectedPlayers(prev => {
                    console.log("Updating connectedPlayers, previous state:", prev);
                    const newState = [...prev, messageData.userId];
                    console.log("New connectedPlayers state:", newState);
                    return newState;
                });
                break;
            case "PLAYER_DISCONNECTED":
                console.log("Switch case: PLAYER_DISCONNECTED");
                console.log("Current connectedPlayers:", connectedPlayers);
                setConnectedPlayers(prev => {
                    console.log("Updating connectedPlayers, previous state:", prev);
                    const newState = prev.filter(id => id !== messageData.userId);
                    console.log("New connectedPlayers state:", newState);
                    return newState;
                });
                break;
            default:
                console.log("Switch case: default");
                break;
        }

        getGameInfo();
    };

    const { socket } = useWebSocket(handleGamePendingPageWebSocketMessage, userInfo?.user_id, []);

    // Memoize getGameInfo function
    const memoizedGetGameInfo = useMemo(() => getGameInfo, [gameId]);

    // Initial fetch of game info
    useEffect(() => {
        memoizedGetGameInfo();
    }, [memoizedGetGameInfo]);

    return {
        hasPlayerJoined,
        gameInfo,
        setGameInfo,
        contractAddress,
        ownerAddress,
        contractBalance,
        getGameInfo: memoizedGetGameInfo,
        player_one,
        player_two,
        gameState,
        connectedPlayers,
        readyPlayers
    };
};

export default UseGamePendingWebsocket;
