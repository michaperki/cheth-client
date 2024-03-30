import { useEffect, useMemo, useState } from 'react';
import useWebSocket from './useWebsocket';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import { useSDK } from "@metamask/sdk-react"; // Import MetaMask SDK
import useWallet from '../useWallet';

const UseGamePendingWebsocket = (gameId) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [hasPlayerJoined, setHasPlayerJoined] = useState(false);
    const [joinedPlayers, setJoinedPlayers] = useState([]);
    const [gameInfo, setGameInfo] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [ownerAddress, setOwnerAddress] = useState(null);
    const [contractBalance, setContractBalance] = useState(0); // State variable for contract balance

    const { walletAddress, connectAccount } = useWallet();

    const ethToUsdRate = useEthereumPrice();
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
            console.log("Game Joined. Updating contract balance...");

            // Update the joined players list using functional form of setJoinedPlayers
            setJoinedPlayers(prevPlayers => {
                // Check if the player already exists in the list
                if (!prevPlayers.includes(messageData.player)) {
                    return [...prevPlayers, messageData.player]; // Add player if not present
                }
                return prevPlayers; // Otherwise, return the existing array
            });
            // Check if the player's address matches any of the joined players
            const hasJoined = joinedPlayers.some(player => player === walletAddress);
            setHasPlayerJoined(hasJoined);

            getGameInfo();
        }

        if (messageData.type === "GAME_PRIMED") {
            console.log("Game is primed. Navigating to game page...");
            navigate(`/game/${gameId}`);
        }

        // Handle FUNDS_TRANSFERRED message
        if (messageData.type === "FUNDS_TRANSFERRED") {
            // Convert transferred amount from wei to USD
            // first convert the amount to ether
            const transferredInEth = Web3.utils.fromWei(messageData.amount, 'ether');
            const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
            console.log('Received funds:', transferredInEth, 'ETH');
            console.log('Received funds:', transferredInUsd, 'USD');
            // Show Snackbar notification
            setSnackbarMessage(`You received $${transferredInUsd}.`);
            setSnackbarOpen(true);
        }
    };

    const socket = useWebSocket(handleGamePendingPageWebSocketMessage);

    // Memoize getGameInfo function
    const memoizedGetGameInfo = useMemo(() => getGameInfo, []);

    return {
        snackbarOpen,
        snackbarMessage,
        setSnackbarOpen,
        hasPlayerJoined,
        joinedPlayers,
        gameInfo,
        setGameInfo,
        contractAddress,
        ownerAddress,
        contractBalance,
        getGameInfo: memoizedGetGameInfo
    };
};

export default UseGamePendingWebsocket;
