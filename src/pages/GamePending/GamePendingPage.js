import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chess from '../../abis/Chess.json';
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import { Typography, Snackbar } from '@mui/material'; // Import MUI components
import { useEthereumPrice } from '../../contexts/EthereumPriceContext'; // Import Ethereum price context
import { useWallet, useGamePendingWebsocket, useSnackbar } from '../../hooks';
import Web3 from 'web3';
import GamePendingContent from '../../components/GamePending';
import './GamePendingPage.css';

const GamePendingPage = ({ userInfo }) => {
    const { gameId } = useParams();
    const [contractInstance, setContractInstance] = useState(null);
    const [joinedPlayers, setJoinedPlayers] = useState([]); // State variable to store joined players
    const theme = useTheme(); // Get the current theme
    const { walletAddress, connectAccount, connected, provider } = useWallet();
    const ethToUsdRate = useEthereumPrice(); // Fetch Ethereum to USD exchange rate
    const {
        snackbarOpen,
        snackbarMessage,
        setSnackbarOpen,
        setSnackbarMessage,
        handleSnackbarClose
    } = useSnackbar();

    const {
        hasPlayerJoined,
        gameInfo,
        setGameInfo,
        contractAddress,
        contractBalance,
        getGameInfo,
        player_one,
        player_two,
        gameState,
    } = useGamePendingWebsocket(gameId, userInfo, setSnackbarOpen, setSnackbarMessage);

    useEffect(() => {
        getGameInfo();
    }, [getGameInfo]);

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
        <div className={`game-pending-container bg-${theme.palette.mode}`}>
            {gameInfo && parseInt(gameState) !== -1 ? (
                <GamePendingContent
                    gameInfo={gameInfo}
                    gameState={gameState}
                    player_one={player_one}
                    player_two={player_two}
                    contractBalance={contractBalance}
                    ethToUsdRate={ethToUsdRate}
                    hasPlayerJoined={hasPlayerJoined}
                    joinGame={joinGame}
                    cancelGame={cancelGame}
                />
            ) : (
                <Typography sx={{ mb: 2 }}>Game has been cancelled.</Typography>
            )}
            <CustomSnackbar open={snackbarOpen} message={snackbarMessage} onClose={handleSnackbarClose} />
        </div>
    );
};

const CustomSnackbar = ({ open, message, onClose }) => (
    <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        autoHideDuration={1000}
        onClose={onClose}
        message={message}
        className="snackbar"
    />
);

export default GamePendingPage;