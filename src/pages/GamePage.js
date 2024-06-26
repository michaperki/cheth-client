import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameDetails, useGameActions } from '../hooks';
import { GameInterface, GameActionsBar, GameSnackbar } from '../components/game';
import { useTheme } from '@mui/material/styles';
import { useEthereumPrice } from '../contexts/EthereumPriceContext';

const GamePage = ({ userInfo }) => {
    const { gameId } = useParams();
    const theme = useTheme();
    const ethToUsdRate = useEthereumPrice(); // Fetch Ethereum to USD exchange rate

    const {
        gameInfo,
        playerOne,
        playerTwo,
        gameOver,
        winner,
        winnerPaid,
        handleFetchGameInfo,
        snackbarInfo,
    } = useGameDetails(gameId, userInfo);

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

    return (
        <div className={`game-page-container bg-${theme.palette.mode}`}>
            <GameInterface
                gameInfo={gameInfo}
                playerOne={playerOne}
                playerTwo={playerTwo}
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
            />
            <GameSnackbar
                open={snackbarInfo.open}
                message={snackbarInfo.message}
                onClose={snackbarInfo.handleClose}
            />
        </div>
    );
};

export default GamePage;
