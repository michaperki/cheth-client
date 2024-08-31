import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameActions } from '../hooks';
import { useGameWebsocket } from '../hooks/websocket';
import { GameInterface, GameActionsBar, GameSnackbar } from '../components/game';
import GameCompleteScreen from '../components/GameComplete/GameCompleteScreen.js';
import { useTheme } from '@mui/material/styles';
import { useEthereumPrice } from '../contexts/EthereumPriceContext';

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

    console.log("game info");
    console.log(gameInfo);

    // Check if the game is complete (state 5)
    const isGameComplete = gameInfo && gameInfo.state === "5";

    return (
        <div className={`game-page-container bg-${theme.palette.mode}`}>
            {isGameComplete ? (
                <GameCompleteScreen
                  playerOne={playerOne}
                  playerTwo={playerTwo}
                  winner={winner}
                  userInfo={userInfo}
                  onRematch={handleRematch}
                />
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
                    />
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
