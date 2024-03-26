import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import useWebSocket from '../hooks/useWebsocket';
import Chess from '../abis/Chess.json';
import { useSDK } from "@metamask/sdk-react"; // Import MetaMask SDK
import Web3 from 'web3';
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import { Button, Typography, Snackbar } from '@mui/material'; // Import MUI components
import { useEthereumPrice } from '../contexts/EthereumPriceContext'; // Import Ethereum price context
import NumberDisplay from '../components/game/NumberDisplay';

const GamePendingPage = () => {
    const { gameId } = useParams();
    const { sdk, connected, connecting, provider, chainId } = useSDK();
    const { walletAddress, connectAccount } = useWallet();
    const [userInfo, setUserInfo] = useState(null);
    const [gameInfo, setGameInfo] = useState(null);
    const [contractInstance, setContractInstance] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [ownerAddress, setOwnerAddress] = useState(null);
    const [contractBalance, setContractBalance] = useState(0); // State variable for contract balance
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State to manage Snackbar open/close
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State to store Snackbar message
    const [hasPlayerJoined, setHasPlayerJoined] = useState(false); // State to indicate if the player has joined the game
    const [joinedPlayers, setJoinedPlayers] = useState([]); // State to store the list of joined players

    const theme = useTheme(); // Get the current theme
    const web3 = new Web3(provider);
    const ethToUsdRate = useEthereumPrice(); // Fetch Ethereum to USD exchange rate

    const navigate = useNavigate();

    useEffect(() => {
        // Set up contract instance when contract address is available
        if (contractAddress && provider) {
            const contract = new web3.eth.Contract(Chess.abi, contractAddress);
            setContractInstance(contract);
        }
    }, [contractAddress, provider]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/getUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ walletAddress: walletAddress })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setUserInfo(data);

            } catch (error) {
                console.error('Error:', error);
            }
        }

        if (walletAddress) {
            getUser();
        }
    }, [walletAddress]);

    useEffect(() => {
        if (!walletAddress) {
            connectAccount();
        }
    }, [walletAddress, connectAccount]);

    const getGameInfo = async () => {
        try {
            console.log('Fetching game info...');
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getGame?gameId=${gameId}`);
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

    // Inside the handleWebSocketMessage function
    function handleWebSocketMessage(message) {
        console.log('Received message in GamePendingPage:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);

        if (messageData.type === "GAME_JOINED") {
            console.log("Game Joined. Updating contract balance...");

            // update the joined players list
            setJoinedPlayers(prev => [...prev, messageData.player]);

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
            const transferredInEth = web3.utils.fromWei(messageData.amount, 'ether');
            const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
            console.log('Received funds:', transferredInEth, 'ETH');
            console.log('Received funds:', transferredInUsd, 'USD');
            // Show Snackbar notification
            setSnackbarMessage(`You received $${transferredInUsd}.`);
            setSnackbarOpen(true);
        }
    }

    // Use the useWebSocket hook    
    const socket = useWebSocket(handleWebSocketMessage);

    // Snackbar close handler
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    useEffect(() => {
        // Fetch game info when gameId changes
        if (gameId) {
            getGameInfo();
        }
    }, [gameId]);



    const joinGame = async () => {
        try {
            if (!connected) {
                await sdk.requestPermissions({ eth_accounts: {} });
            }
            if (!contractInstance) {
                throw new Error('Contract instance not available');
            }

            const entryFeeInWei = await contractInstance.methods.getEntryFee().call();
            const tx = await contractInstance.methods.joinGame().send({
                from: walletAddress,
                value: entryFeeInWei,
                gas: 3000000
            });
            setGameInfo(prev => ({ ...prev, transactionHash: tx.transactionHash }));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const cancelGame = async () => {
        try {
            await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/cancelGame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameId })
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <div className={`max-w-md w-full p-8 bg-${theme.palette.mode === 'dark' ? 'black' : 'white'} rounded shadow-lg`}>
            <Typography variant="h3" sx={{ mb: 4 }}>Game Pending</Typography>
            {gameInfo && (parseInt(gameInfo.state) === 2 || parseInt(gameInfo.state) === 3) && (
                <div>
                    <Typography sx={{ mb: 2 }}>Game ID: {gameInfo.game_id}</Typography>

                    <Typography sx={{ mb: 2 }}>Contract Balance
                        <NumberDisplay amount={web3.utils.fromWei(contractBalance, 'ether') * ethToUsdRate} />

                    </Typography>

                    {/* display the players */}
                    <Typography sx={{ mb: 2 }}>Players: {gameInfo.player1_id} vs {gameInfo.player2_id}</Typography>
                    <Button
                        onClick={joinGame}
                        variant="contained"
                        color="primary"
                        sx={{ '&:hover': { bgcolor: 'primary.dark' }, mr: 2 }}
                        disabled={hasPlayerJoined} // Disable the button if the player has already joined
                    >
                        Join Game
                    </Button>



                    <Button
                        onClick={cancelGame}
                        variant="contained"
                        color="error"
                        sx={{ '&:hover': { bgcolor: 'error.dark' } }}
                    >
                        Cancel Game
                    </Button>
                </div>
            )}
            {gameInfo && parseInt(gameInfo.state) === -1 && (
                <Typography sx={{ mb: 2 }}>Game has been cancelled.</Typography>
            )}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
}

export default GamePendingPage;