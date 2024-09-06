// src/pages/GamePending/GamePendingPage.js

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Chess from 'abis/Chess.json';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useEthereumPrice } from 'contexts/EthereumPriceContext';
import { useWallet, useGamePendingWebsocket } from 'hooks';
import Web3 from 'web3';
import GamePendingContent from 'components/GamePending';
import './GamePendingPage.css';
import { toast } from 'react-toastify';
import { setHasPlayerJoined, setCurrentGame } from 'store/slices/gameSlice';

const GamePendingPage = ({ userInfo }) => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [contractInstance, setContractInstance] = useState(null);
    const dispatch = useDispatch();
    const theme = useTheme();
    const { walletAddress, connectAccount, connected, provider } = useWallet();
    const ethToUsdRate = useEthereumPrice();

    const gameInfo = useSelector(state => state.game.currentGame);
    const hasPlayerJoined = useSelector(state => state.game.hasPlayerJoined);
    const contractAddress = useSelector(state => state.game.contractAddress);
    const contractBalance = useSelector(state => state.game.contractBalance);
    const playerOne = useSelector(state => state.game.playerOne);
    const playerTwo = useSelector(state => state.game.playerTwo);
    const gameState = useSelector(state => state.game.currentGame?.state);
    const connectedPlayers = useSelector(state => state.game.connectedPlayers);

    const { getGameInfo } = useGamePendingWebsocket(gameId, userInfo);

    useEffect(() => {
        if (provider && contractAddress) {
            console.log('Creating contract instance...');
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(Chess.abi, contractAddress);
            setContractInstance(contract);
        }
    }, [provider, contractAddress]);

    useEffect(() => {
        if (gameState === "4") {
          navigate(`/game/${gameId}`);
        }
    }, [gameState, gameId, navigate]);

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
            dispatch(setCurrentGame({ ...gameInfo, transactionHash: tx.transactionHash }));
            dispatch(setHasPlayerJoined(true));
            toast.success('Successfully joined the game!');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to join the game. Please try again.');
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
            toast.info('Game has been cancelled.');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to cancel the game. Please try again.');
        }
    }

    return (
        <div className={`game-pending-container bg-${theme.palette.mode}`}>
            {gameInfo && parseInt(gameState) !== -1 ? (
                <GamePendingContent
                    gameInfo={gameInfo}
                    gameState={gameState}
                    contractBalance={contractBalance}
                    ethToUsdRate={ethToUsdRate}
                    hasPlayerJoined={hasPlayerJoined}
                    joinGame={joinGame}
                    cancelGame={cancelGame}
                />
            ) : (
                <Typography sx={{ mb: 2 }}>Game has been cancelled.</Typography>
            )}
        </div>
    );
};

export default GamePendingPage;
