import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGameActions } from '../../hooks';
import { useGameWebsocket } from '../../hooks/websocket';
import { GameInterface, GameActionsBar } from '../../components/game';
import GameCompleteScreen from '../../components/GameComplete/GameCompleteScreen';
import { Typography, Button, Box } from '@mui/material';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import { resetGameState, setRematchRequested } from '../../store/slices/gameStateSlice';

const GamePage = () => {
    const { gameId } = useParams();
    const dispatch = useDispatch();
    const ethToUsdRate = useEthereumPrice();
    const userInfo = useSelector((state) => state.user.userInfo);
    const {
        gameInfo,
        gameOver,
        winner,
        winnerPaid,
        rematchRequested,
        rematchRequestedBy
    } = useSelector((state) => state.gameState);

    const {
        handleFetchGameInfo,
    } = useGameWebsocket(gameId, userInfo, dispatch);

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
        return () => {
            dispatch(resetGameState());
        };
    }, [gameId, handleFetchGameInfo, dispatch]);

    const isGameComplete = gameInfo && gameInfo.state === "5";

    const renderRematchUI = () => {
        if (!userInfo) return null;

        if (rematchRequested && rematchRequestedBy !== userInfo.user_id) {
            return (
                <Box mt={2}>
                    <Typography variant="body1">Your opponent has requested a rematch!</Typography>
                    <Button onClick={handleAcceptRematch} variant="contained" color="primary" sx={{ mr: 1, mt: 1 }}>
                        Accept Rematch
                    </Button>
                    <Button onClick={handleDeclineRematch} variant="contained" color="secondary" sx={{ mt: 1 }}>
                        Decline Rematch
                    </Button>
                </Box>
            );
        } else if (rematchRequested && rematchRequestedBy === userInfo.user_id) {
            return (
                <Box mt={2}>
                    <Typography variant="body1">Waiting for opponent to accept rematch...</Typography>
                    <Button onClick={handleCancelRematch} variant="contained" color="secondary" sx={{ mt: 1 }}>
                        Cancel Rematch Request
                    </Button>
                </Box>
            );
        }
        return null;
    };

    const resetRematchState = () => {
        dispatch(setRematchRequested({ requested: false, requestedBy: null }));
    };

    if (!userInfo) {
        return <Typography>Loading user information...</Typography>;
    }

    return (
        <div className="game-page-container">
            {isGameComplete ? (
                <>
                    <GameCompleteScreen onRematch={handleRematch} />
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
