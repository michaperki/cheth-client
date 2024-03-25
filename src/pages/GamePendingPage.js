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
    const web3 = new Web3(provider); // Create a new Web3 instance

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


/// why is the etherium to usd rate not available?

// ETH to USD conversion rate: 3438.41
// useWebsocket.js:17 Connected to WebSocket
// useWebsocket.js:21 Received message in useWebsocket hook: {"type":"ONLINE_USERS_COUNT","count":1}
// GamePendingPage.js:81 Received message in GamePendingPage: {"type":"ONLINE_USERS_COUNT","count":1}
// GamePendingPage.js:83 messageData Object
// GamePendingPage.js:58 Game data: Object
// GamePendingPage.js:62 Game is ready. Navigating to game page...
// GamePendingPage.js:63 Game contract address: 0xEC8bAC9374450D79E4956aAf002471E25B09710a
// useWebsocket.js:21 Received message in useWebsocket hook: {"type":"ONLINE_USERS_COUNT","count":2}
// GamePendingPage.js:81 Received message in GamePendingPage: {"type":"ONLINE_USERS_COUNT","count":2}
// GamePendingPage.js:83 messageData Object
// GamePendingPage.js:190  Error: uR: Parameter decoding error: Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced.
//     at eH (https://cheth-client.vercel.app/static/js/main.8505e924.js:2:2837719)
//     at tH (https://cheth-client.vercel.app/static/js/main.8505e924.js:2:2837802)
//     at https://cheth-client.vercel.app/static/js/main.8505e924.js:2:2886299
//     at Contract.<anonymous> (https://cheth-client.vercel.app/static/js/main.8505e924.js:2:2886352)
//     at Generator.next (<anonymous>)
//     at a (https://cheth-client.vercel.app/static/js/main.8505e924.js:2:2877622)
// onClick @ GamePendingPage.js:190
// useWebsocket.js:21 Received message in useWebsocket hook: {"type":"GAME_JOINED","gameId":112,"player":"0x883fFb458336966669473732baD48e5438AF8fde"}
// GamePendingPage.js:81 Received message in GamePendingPage: {"type":"GAME_JOINED","gameId":112,"player":"0x883fFb458336966669473732baD48e5438AF8fde"}
// GamePendingPage.js:83 messageData {type: 'GAME_JOINED', gameId: 112, player: '0x883fFb458336966669473732baD48e5438AF8fde'}
// GamePendingPage.js:86 Game Joined. Updating contract balance...
// GamePendingPage.js:52 Fetching game info...
// GamePendingPage.js:58 Game data: {game_id: 112, contract_address: '0xEC8bAC9374450D79E4956aAf002471E25B09710a', transaction_hash: '0xc1c8db8e1b813d4195358a3f09454e5b77097485ecd26611c4276190612cfe30', game_creator_address: '0x1740CC8924FC812725ACA36Be29a0B677B300171', player1_id: 9, …}
// useWebsocket.js:21 Received message in useWebsocket hook: {"type":"FUNDS_TRANSFERRED","to":"0x883fFb458336966669473732baD48e5438AF8fde","amount":"10000000000000000"}
// GamePendingPage.js:81 Received message in GamePendingPage: {"type":"FUNDS_TRANSFERRED","to":"0x883fFb458336966669473732baD48e5438AF8fde","amount":"10000000000000000"}
// GamePendingPage.js:83 messageData {type: 'FUNDS_TRANSFERRED', to: '0x883fFb458336966669473732baD48e5438AF8fde', amount: '10000000000000000'}
// GamePendingPage.js:108 ETH to USD conversion rate not available

// The ETH to USD conversion rate is not available because the fetchEthToUsdRate function is called in the useEffect hook with an empty dependency array. This means that the function is only called once when the component mounts, and the conversion rate is fetched only once. If the conversion rate is not available at that time, it will not be fetched again.
// but the conversion rate is fetched when the component mounts, so why is it not available when the funds are transferred?
// The issue is that the funds are transferred before the conversion rate is fetched. The fetchEthToUsdRate function is asynchronous, so it takes some time to fetch the conversion rate. If the funds are transferred before the conversion rate is available, the conversion rate will be 0, and the message "ETH to USD conversion rate not available" will be logged.
// To fix this issue, you can wait for the conversion rate to be fetched before processing the transferred funds. You can do this by checking if the conversion rate is available before converting the funds from wei to USD. If the conversion rate is not available, you can log a message or handle the funds differently. Here's an updated version of the handleWebSocketMessage function that checks if the conversion rate is available before processing the transferred funds:
// Inside the handleWebSocketMessage function
// if (messageData.type === "FUNDS_TRANSFERRED") {
//     // Check if ethToUsdRate is available
//     if (ethToUsdRate > 0) {
//         // Convert transferred funds from wei to ether
//         const transferredInEth = Web3.utils.fromWei(messageData.amount, 'ether');
//         // Convert transferred funds from ether to USD using the conversion rate
//         const transferredInUsd = (transferredInEth * ethToUsdRate).toFixed(2);
//         // Show Snackbar notification with transferred funds in USD
//         setSnackbarMessage(`You received $${transferredInUsd}.`);
//         setSnackbarOpen(true);
//     } else {
//         console.log('ETH to USD conversion rate not available');
//     }
// }

// This updated version of the handleWebSocketMessage function checks if the ethToUsdRate is greater than 0 before processing the transferred funds. If the conversion rate is available, the transferred funds are converted from wei to USD and a Snackbar notification is shown. If the conversion rate is not available, a message is logged to indicate that the conversion rate is not available. This ensures that the transferred funds are processed correctly when the conversion rate is available.
// By making this change, you can ensure that the transferred funds are processed correctly even if the conversion rate is not available at the time of the transfer.

// but I want the conversion rate to be fetched before the funds are transferred, how can I do that?
// To ensure that the conversion rate is fetched before the funds are transferred, you can update the useEffect hook that fetches the conversion rate to also fetch the funds transfer message. This way, the conversion rate will be available before the funds are transferred, and the transferred funds can be processed correctly. Here's an updated version of the useEffect hook that fetches the conversion rate and funds transfer message:
// useEffect(() => {
//     const fetchEthToUsdRate = async () => {
//         try {
//             const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/ethToUsd`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch ETH to USD conversion rate');
//             }
//             const data = await response.json();
//             console.log('ETH to USD conversion rate:', data);
//             setEthToUsdRate(data);

//             // Check if funds transfer message is available
//             if (fundsTransferMessage) {
//                 // Process the transferred funds
//                 handleWebSocketMessage(fundsTransferMessage);
//             }
//         } catch (error) {
//             console.error('Error fetching ETH to USD conversion rate:', error);
//         }
//     };

//     fetchEthToUsdRate();
// }, [fundsTransferMessage]);