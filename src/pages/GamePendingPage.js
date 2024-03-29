import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chess from '../abis/Chess.json';
import { useSDK } from "@metamask/sdk-react"; // Import MetaMask SDK
import Web3 from 'web3';
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import { Button, Typography, Snackbar } from '@mui/material'; // Import MUI components
import { useEthereumPrice } from '../contexts/EthereumPriceContext'; // Import Ethereum price context
import NumberDisplay from '../components/game/NumberDisplay';
import UseGamePendingWebsocket from '../hooks/websocket/UseGamePendingWebsocket';

const GamePendingPage = ({ userInfo }) => {
    const { gameId } = useParams();
    const { sdk, connected, provider } = useSDK();
    const [contractInstance, setContractInstance] = useState(null);
    const theme = useTheme(); // Get the current theme
    const web3 = new Web3(provider); // Create 
    const ethToUsdRate = useEthereumPrice(); // Fetch Ethereum to USD exchange rate
    const {
        snackbarOpen,
        snackbarMessage,
        setSnackbarOpen,
        hasPlayerJoined,
        joinedPlayers,
        gameInfo,
        setGameInfo,
        contractAddress,
        contractBalance,
        getGameInfo } = UseGamePendingWebsocket(gameId);


    useEffect(() => {
        // Set up contract instance when contract address is available
        if (contractAddress && provider) {
            console.log('Setting up contract instance...');
            console.log('Contract address:', contractAddress);
            console.log('Provider:', provider);
            const contract = new web3.eth.Contract(Chess.abi, contractAddress);
            setContractInstance(contract);
        }
    }, [contractAddress, provider]);

    useEffect(() => {
        console.log('Fetching game info inside GamePendingPage...');
        getGameInfo();
    }, []);


    // Snackbar close handler
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const joinGame = async () => {
        try {
            if (!connected) {
                await sdk.requestPermissions({ eth_accounts: {} });
            }
            if (!contractInstance) {
                throw new Error('Contract instance not available');
            }


            const entryFeeInWei = await contractInstance.methods.getEntryFee().call();
            console.log('Entry fee in wei:', entryFeeInWei);
            console.log('contract methods:', contractInstance.methods);
            const tx = await contractInstance.methods.joinGame().send({
                from: userInfo.wallet_address,
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

                    {/* Show different content based on whether the player has joined */}
                    {hasPlayerJoined ? (
                        <Typography sx={{ mb: 2 }}>Waiting for opponent to join</Typography>
                    ) : (
                        <Button
                            onClick={joinGame}
                            variant="contained"
                            color="primary"
                            sx={{ '&:hover': { bgcolor: 'primary.dark' }, mr: 2 }}
                        >
                            Join Game
                        </Button>
                    )}

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
            {/* log the joined players, they have duplicate entries */}
            {joinedPlayers.length > 0 && (
                <Typography sx={{ mt: 4 }}>Joined Players: {joinedPlayers.join(', ')}</Typography>
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