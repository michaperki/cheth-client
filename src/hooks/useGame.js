import { useEffect, useState } from 'react';
import useWebSocket from './useWebsocket';
import useWallet from './useWallet';
import useContract from './useContract';
import { useNavigate } from 'react-router-dom';
import web3 from 'web3'; // Import web3 here

const useGame = (gameId, getGameInfo) => {
    const navigate = useNavigate();
    const { walletAddress, connectAccount } = useWallet();
    const { contractInstance, contractAddress, contractBalance, joinGame, cancelGame } = useContract(gameId, walletAddress);
    const [gameInfo, setGameInfo] = useState(null);
    const [hasPlayerJoined, setHasPlayerJoined] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const ethToUsdRate = 0; // Placeholder for ethToUsdRate

    useEffect(() => {
        if (gameId) {
            const data = getGameInfo(gameId); // Call the passed function with gameId
            setGameInfo(data);
        }
    }, [gameId, getGameInfo]); // Add gameId and getGameInfo to the dependency array

    useEffect(() => {
        if (!walletAddress) {
            connectAccount();
        }
    }, [walletAddress, connectAccount]);

    useEffect(() => {
        if (gameInfo) {
            const player1 = gameInfo.player1_id;
            const player2 = gameInfo.player2_id;
            if (player1 === walletAddress || player2 === walletAddress) {
                setHasPlayerJoined(true);
            }
        }
    }, [gameInfo, walletAddress]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleWebSocketMessage = (message) => {
        console.log('Received message in GamePendingPage:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);

        if (messageData.type === "GAME_JOINED") {
            console.log("Game Joined. Updating contract balance...");
            const data = getGameInfo(gameId); // Call the passed function with gameId
            setGameInfo(data);
        }

        if (messageData.type === "GAME_PRIMED") {
            console.log("Game is primed. Navigating to game page...");
            navigate(`/game/${gameId}`);
        }

        if (messageData.type === "FUNDS_TRANSFERRED") {
            const transferredInEth = web3.utils.fromWei(messageData.amount, 'ether');
            const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
            console.log('Received funds:', transferredInEth, 'ETH');
            console.log('Received funds:', transferredInUsd, 'USD');
            setSnackbarMessage(`You received $${transferredInUsd}.`);
            setSnackbarOpen(true);
        }
    };

    return { gameInfo, joinGame, cancelGame, hasPlayerJoined, snackbarOpen, snackbarMessage, handleSnackbarClose, handleWebSocketMessage };
};

export default useGame;
