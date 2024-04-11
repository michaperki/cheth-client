import { useMemo, useState } from 'react';
import useWebSocket from './useWebsocket';
import { useNavigate } from 'react-router-dom';

const UseGamePendingWebsocket = (gameId, userInfo, setSnackbarOpen, setSnackbarMessage) => {
    const [hasPlayerJoined, setHasPlayerJoined] = useState(false);
    const [gameInfo, setGameInfo] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [ownerAddress, setOwnerAddress] = useState(null);
    const [contractBalance, setContractBalance] = useState(0); // State variable for contract balance
    const [player_one, setPlayerOne] = useState(null);
    const [player_two, setPlayerTwo] = useState(null);
    const [gameState, setGameState] = useState(null);

    const navigate = useNavigate();
    const getGameInfo = async () => {
        try {
            console.log('Fetching game info inside UseGamePendingWebsocket...');
            // game is available at /game/:gameId
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/${gameId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch game information');
            }
            const gameData = await response.json();
            console.log('Game data:', gameData);
            setGameInfo(gameData);
            setGameState(gameData.state);

            const player1Response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${gameData.player1_id}`, {
                method: 'POST', // Send a POST request
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: gameData.player1_id }) // Send user ID in the request body
            });

            if (!player1Response.ok) {
                throw new Error('Failed to fetch game information');
            }

            const player1Data = await player1Response.json();
            console.log('Player 1 data:', player1Data);
            setPlayerOne(player1Data);

            const player2Response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${gameData.player2_id}`, {
                method: 'POST', // Send a POST request
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: gameData.player2_id }) // Send user ID in the request body
            });

            if (!player2Response.ok) {
                throw new Error('Failed to fetch game information');
            }

            const player2Data = await player2Response.json();
            console.log('Player 2 data:', player2Data);
            setPlayerTwo(player2Data);

            if (gameData && parseInt(gameData.state) === 2) {
                console.log('Game is ready. Navigating to game page...');
                console.log('Game contract address:', gameData.contract_address);
                setContractAddress(gameData.contract_address);
                setOwnerAddress(gameData.game_creator_address);
                setContractBalance(gameData.reward_pool); // Update contract balance
            }

            if (gameData && parseInt(gameData.state) === 3) {
                setContractAddress(gameData.contract_address);
                setOwnerAddress(gameData.game_creator_address);
                setContractBalance(gameData.reward_pool); // Update contract balance
            }
        } catch (error) {
            console.error('Error fetching game status:', error);
        }
    };

    const handleGamePendingPageWebSocketMessage = (message) => {
        console.log('Received message in GamePendingWebsocket:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);

        if (messageData.type === "GAME_JOINED") {
            console.log("Game Joined...");

            const newPlayerWallet = messageData.player;
            const hasJoined = newPlayerWallet === userInfo.wallet_address;

            setHasPlayerJoined(hasJoined);
        }

        if (messageData.type === "GAME_PRIMED") {
            console.log("Game is primed. Navigating to game page...");
            navigate(`/game/${gameId}`);
        }

        getGameInfo();
    };

    const socket = useWebSocket(handleGamePendingPageWebSocketMessage, userInfo?.user_id, ['ONLINE_USERS_COUNT', 'FUNDS_TRANSFERRED'], setSnackbarOpen, setSnackbarMessage);

    // Memoize getGameInfo function
    const memoizedGetGameInfo = useMemo(() => getGameInfo, []);

    return {
        setSnackbarOpen,
        hasPlayerJoined,
        gameInfo,
        setGameInfo,
        contractAddress,
        ownerAddress,
        contractBalance,
        getGameInfo: memoizedGetGameInfo,
        player_one,
        player_two,
        gameState
    };
};

export default UseGamePendingWebsocket;
