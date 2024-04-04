import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chess from '../../abis/Chess.json';
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import { Button, Typography, Snackbar, Box } from '@mui/material'; // Import MUI components
import { useEthereumPrice } from '../../contexts/EthereumPriceContext'; // Import Ethereum price context
import NumberDisplay from '../../components/game/NumberDisplay';
import UseGamePendingWebsocket from '../../hooks/websocket/UseGamePendingWebsocket';
import MatchupPodium from '../../components/game/MatchUpPodium';
// import useWallet
import useWallet from '../../hooks/useWallet';
import Web3 from 'web3';

const GamePendingPage = ({ userInfo }) => {
    const { gameId } = useParams();
    const [contractInstance, setContractInstance] = useState(null);
    const [joinedPlayers, setJoinedPlayers] = useState([]); // State variable to store joined players
    const theme = useTheme(); // Get the current theme
    const { walletAddress, connectAccount, connected, provider, sdk } = useWallet();
    const ethToUsdRate = useEthereumPrice(); // Fetch Ethereum to USD exchange rate
    const {
        snackbarOpen,
        snackbarMessage,
        setSnackbarOpen,
        hasPlayerJoined,
        gameInfo,
        setGameInfo,
        contractAddress,
        contractBalance,
        getGameInfo,
        player_one,
        player_two,
        gameState,
    } = UseGamePendingWebsocket(gameId, userInfo);
    console.log('Game info:', gameInfo);
    console.log('Contract address:', contractAddress);

    console.log('Wallet address:', walletAddress);
    console.log('Connected:', connected);
    console.log('Provider:', provider);

    useEffect(() => {
        console.log('Fetching game info inside GamePendingPage...');
        getGameInfo();
    }, []);

    useEffect(() => {
        // Update joined players when game info changes
        if (gameInfo) {
            const updatedJoinedPlayers = [];
            if (gameInfo.player1_ready) {
                updatedJoinedPlayers.push(gameInfo.player1_id);
            }
            if (gameInfo.player2_ready) {
                updatedJoinedPlayers.push(gameInfo.player2_id);
            }
            setJoinedPlayers(updatedJoinedPlayers);
        }
    }, [gameInfo]);

    useEffect(() => {
        if (provider && contractAddress) {
            console.log('Creating contract instance...');
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(Chess.abi, contractAddress);
            setContractInstance(contract);
        }
    }, [provider, contractAddress]);

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
                console.error('Not connected to MetaMask');
                connectAccount();
                return;
            }

            if (!contractInstance) {
                throw new Error('Contract instance not available');
            }

            const entryFeeInWei = await contractInstance.methods.getEntryFee().call();
            console.log('Entry fee in wei:', entryFeeInWei);

            const tx = await contractInstance.methods.joinGame().send({
                from: walletAddress,
                value: entryFeeInWei,
                gas: 3000000,
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
        <div className={`max-w-md w-full p-8 bg-${theme.palette.mode === 'dark' ? 'black' : 'white'}`}>
            <Typography variant="h3" sx={{ mb: 4 }}>Game Pending</Typography>
            {console.log('gameState:', gameState)}
            {gameInfo && (parseInt(gameState) === 2 || parseInt(gameState) === 3) && (
                <div>
                    <Typography sx={{ mb: 2 }}>Game ID: {gameInfo.game_id}</Typography>


                    {/* display the players */}
                    {player_one && player_two &&
                        <div style={{ marginBottom: '20px', minHeight: '110px' }}>
                            <MatchupPodium playerOne={player_one} playerTwo={player_two} joinedPlayers={joinedPlayers} />
                        </div>
                    }
                    <NumberDisplay amount={Web3.utils.fromWei(contractBalance, 'ether') * ethToUsdRate} />


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

            {gameInfo && parseInt(gameState) === -1 && (
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
