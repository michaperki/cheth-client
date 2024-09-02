// src/pages/GamePage.js

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGameActions } from '../hooks';
import { useGameWebsocket } from '../hooks/websocket';
import { GameInterface, GameActionsBar } from '../components/game';
import GameCompleteScreen from '../components/GameComplete/GameCompleteScreen.js';
import { useTheme } from '@mui/material/styles';
import { useEthereumPrice } from '../contexts/EthereumPriceContext';
import { Typography, Button, Box } from '@mui/material';
import { setPlayerOne, setPlayerTwo, setConnectedPlayers, setCurrentGame } from '../store/slices/gameSlice';

const GamePage = ({ userInfo }) => {
    const { gameId } = useParams();
    const dispatch = useDispatch();
    const theme = useTheme();
    const ethToUsdRate = useEthereumPrice();

    const {
        gameInfo,
        playerOne,
        playerTwo,
        gameOver,
        winner,
        winnerPaid,
        handleFetchGameInfo,
        connectedPlayers,
        rematchRequested,
        rematchRequestedBy,
        rematchWagerSize,
        rematchTimeControl,
        resetRematchState
    } = useGameWebsocket(gameId, userInfo);

    const {
        handleJoinGame,
        handleReportGameOver,
        handleReportIssue,
        handleRematch,
        handleAcceptRematch,
        handleDeclineRematch,
        handleCancelRematch
    } = useGameActions(gameId, userInfo, handleFetchGameInfo, gameInfo?.lichess_id);

    useEffect(() => {
        if (gameId) {
            handleFetchGameInfo();
        }
    }, [gameId, handleFetchGameInfo]);

    useEffect(() => {
        if (gameInfo) {
            dispatch(setCurrentGame(gameInfo));
        }
        if (playerOne) {
            dispatch(setPlayerOne(playerOne));
        }
        if (playerTwo) {
            dispatch(setPlayerTwo(playerTwo));
        }
        if (connectedPlayers) {
            dispatch(setConnectedPlayers(connectedPlayers));
        }
    }, [dispatch, gameInfo, playerOne, playerTwo, connectedPlayers]);

    console.log("game info", gameInfo);

    const isGameComplete = gameInfo && gameInfo.state === "5";

    const renderRematchUI = () => {
        if (!userInfo) return null;

        if (rematchRequested && rematchRequestedBy !== userInfo.user_id) {
            return (
                <Box mt={2}>
                    <Typography variant="body1">Your opponent has requested a rematch!</Typography>
                    <Typography variant="body2">Wager: ${rematchWagerSize}, Time Control: {rematchTimeControl} seconds</Typography>
                    <Button onClick={() => { handleAcceptRematch(); resetRematchState(); }} variant="contained" color="primary" sx={{ mr: 1, mt: 1 }}>
                        Accept Rematch
                    </Button>
                    <Button onClick={() => { handleDeclineRematch(); resetRematchState(); }} variant="contained" color="secondary" sx={{ mt: 1 }}>
                        Decline Rematch
                    </Button>
                </Box>
            );
        } else if (rematchRequested && rematchRequestedBy === userInfo.user_id) {
            return (
                <Box mt={2}>
                    <Typography variant="body1">Waiting for opponent to accept rematch...</Typography>
                    <Button onClick={() => { handleCancelRematch(); resetRematchState(); }} variant="contained" color="secondary" sx={{ mt: 1 }}>
                        Cancel Rematch Request
                    </Button>
                </Box>
            );
        }
        return null;
    };

    if (!userInfo) {
        return <Typography>Loading user information...</Typography>;
    }

    return (
        <div className={`game-page-container bg-${theme.palette.mode}`}>
            {isGameComplete ? (
                <>
                    <GameCompleteScreen
                        playerOne={playerOne}
                        playerTwo={playerTwo}
                        winner={winner}
                        userInfo={userInfo}
                        onRematch={handleRematch}
                    />
                    {renderRematchUI()}
                </>
            ) : (
                <>
                    <GameInterface
                        gameOver={gameOver}
                        winner={winner}
                        winnerPaid={winnerPaid}
                        onJoinGame={handleJoinGame}
                        ethToUsdRate={ethToUsdRate}
                    />
                    <GameActionsBar
                        gameOver={gameOver}
                        onReportGameOver={handleReportGameOver}
                        onReportIssue={handleReportIssue}
                        onRematch={handleRematch}
                        onAcceptRematch={handleAcceptRematch}
                        onDeclineRematch={handleDeclineRematch}
                        onCancelRematch={handleCancelRematch}
                        rematchRequested={rematchRequested}
                        rematchRequestedBy={rematchRequestedBy}
                        userInfo={userInfo}
                        resetRematchState={resetRematchState}
                    />
                    {renderRematchUI()}
                </>
            )}
        </div>
    );
};

export default GamePage;
