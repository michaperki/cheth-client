import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import useWebSocket from '../hooks/useWebsocket';
import Chess from '../abis/Chess.json';
import { useSDK } from "@metamask/sdk-react"; // Import MetaMask SDK
import Web3 from 'web3';
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import { Button, Typography, Snackbar } from '@mui/material'; // Import MUI components

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
    const [ethToUsdRate, setEthToUsdRate] = useState(0);
    const [conversionRateAvailable, setConversionRateAvailable] = useState(false);

    const theme = useTheme(); // Get the current theme
    if (provider) {
        const web3 = new Web3(provider); // Create a new Web3 instance
        // Now you can use the web3 instance for interacting with the Ethereum network
    } else {
        console.error('Provider is not available');
    }
    
    const navigate = useNavigate();
    
    // Use the useWebSocket hook to establish WebSocket connection
    const socket = useWebSocket(handleWebSocketMessage);

    const getGameInfo = async () => {
        try {
            console.log('Fetching game info...');
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/game/${gameId}`);
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

    // Function declaration moved above the useWebSocket hook
    function handleWebSocketMessage(message) {
        console.log('Received message in GamePendingPage:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);

        if (messageData.type === "GAME_JOINED") {
            console.log("Game Joined. Updating contract balance...");
            // Update contract balance with the reward pool from the database
            getGameInfo();
        }

        if (messageData.type === "GAME_PRIMED") {
            console.log("Game is primed. Navigating to game page...");
            navigate(`/game/${gameId}`);
        }

        // Inside the handleWebSocketMessage function
        if (conversionRateAvailable && message.type === "FUNDS_TRANSFERRED") {

            // Convert transferred funds from wei to ether
            const transferredInEth = Web3.utils.fromWei(messageData.amount, 'ether');
            // Convert transferred funds from ether to USD using the conversion rate
            const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
            // Show Snackbar notification with transferred funds in USD
            setSnackbarMessage(`You received $${transferredInUsd}.`);
            setSnackbarOpen(true);
        }
    }

    // Fetch ETH to USD conversion rate
    useEffect(() => {
        const fetchEthToUsdRate = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/ethToUsd`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ETH to USD conversion rate');
                }
                const data = await response.json();
                console.log('ETH to USD conversion rate:', data);
                setEthToUsdRate(data)
                setConversionRateAvailable(true);
            } catch (error) {
                console.error('Error fetching ETH to USD conversion rate:', error);
            }
        };
        fetchEthToUsdRate();
    }, []);

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
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/getUser`, {
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
            await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/cancelGame`, {
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
                    <p>Game is ready. Contract address: {gameInfo.contract_address}</p>
                    <div>
                        <p>Game creator: {ownerAddress}</p>
                        <p>Contract balance: {web3.utils.fromWei(contractBalance, 'ether')} ETH</p>
                        <Button
                            onClick={joinGame}
                            variant="contained"
                            color="primary"
                            sx={{ '&:hover': { bgcolor: 'primary.dark' }, mr: 2 }}
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
                </div>
            )}
            {gameInfo && gameInfo.state === 3 && (
                <div>
                    <p>Game is in progress. Transaction hash: {gameInfo.transactionHash}</p>
                </div>
            )}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                sx={{ background: 'green', color: 'white' }} // Custom styling for green background and white text
            />
        </div>
    );
}

export default GamePendingPage;
