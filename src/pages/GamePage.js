import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameActions } from '../hooks';
import { useGameWebsocket } from '../hooks/websocket';
import { GameInterface, GameActionsBar, GameSnackbar } from '../components/game';
import GameCompleteScreen from '../components/GameComplete/GameCompleteScreen.js';
import { useTheme } from '@mui/material/styles';
import { useEthereumPrice } from '../contexts/EthereumPriceContext';
import { Typography, Button, Box } from '@mui/material';

const GamePage = ({ userInfo }) => {
    const { gameId } = useParams();
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
        snackbarInfo,
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
        handleFetchGameInfo();
    }, [handleFetchGameInfo]);

    console.log("game info", gameInfo);

    const isGameComplete = gameInfo && gameInfo.state === "5";

    const renderRematchUI = () => {
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
                        gameInfo={gameInfo}
                        playerOne={playerOne}
                        playerTwo={playerTwo}
                        gameOver={gameOver}
                        winner={winner}
                        winnerPaid={winnerPaid}
                        onJoinGame={handleJoinGame}
                        ethToUsdRate={ethToUsdRate}
                        connectedPlayers={connectedPlayers}
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
            <GameSnackbar
                open={snackbarInfo.open}
                message={snackbarInfo.message}
                onClose={snackbarInfo.handleClose}
            />
        </div>
    );
};

export default GamePage;
