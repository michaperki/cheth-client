/// refactor this component to use the useContract hook
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWallet from '../hooks/useWallet';

import Chess from '../abis/Chess.json';
import { useSDK } from "@metamask/sdk-react"; // Import MetaMask SDK
import Web3 from 'web3';
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import { Button, Typography, Snackbar } from '@mui/material'; // Import MUI components
import { useEthereumPrice } from '../contexts/EthereumPriceContext'; // Import Ethereum price context
import NumberDisplay from '../components/game/NumberDisplay';
import useGame from '../hooks/useGame';

const GamePendingPage = () => {
    const { gameId } = useParams();
    const { sdk, connected, connecting, provider, chainId } = useSDK();
    const { walletAddress, connectAccount } = useWallet();
    const [userInfo, setUserInfo] = useState(null);
    const [contractInstance, setContractInstance] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [ownerAddress, setOwnerAddress] = useState(null);
    const [contractBalance, setContractBalance] = useState(0); // State variable for contract balance
    const [joinedPlayers, setJoinedPlayers] = useState([]); // State to store the list of joined players   
    const theme = useTheme(); // Get the current theme
    const web3 = new Web3(provider);
    console.log('chainId:', chainId);
    const ethToUsdRate = useEthereumPrice(); // Fetch Ethereum to USD exchange rate
    const { gameInfo, joinGame, cancelGame, hasPlayerJoined, snackbarOpen, snackbarMessage, handleSnackbarClose } = useGame(gameId);

    const navigate = useNavigate();

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

