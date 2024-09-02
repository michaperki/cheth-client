import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GameInterface, GameActionsBar } from '../components/game';
import GameCompleteScreen from '../components/GameComplete/GameCompleteScreen.js';
import { useTheme } from '@mui/material/styles';
import { useEthereumPrice } from '../contexts/EthereumPriceContext';
import { Typography, Button, Box } from '@mui/material';
import {
  fetchGameInfo,
  updateGameState,
  setGameOver,
  setWinner,
  setWinnerPaid,
  setRematchRequested,
  setRematchRequestedBy,
  setRematchWagerSize,
  setRematchTimeControl,
  resetRematchState,
  updatePlayerInfo,
  updateConnectedPlayers
} from '../store/slices/gameSlice';
import {
  joinGame,
  reportGameOver,
  reportIssue,
  requestRematch,
  acceptRematch,
  declineRematch,
  cancelRematch
} from '../store/slices/gameActions';

const GamePage = () => {
  const { gameId } = useParams();
  const theme = useTheme();
  const ethToUsdRate = useEthereumPrice();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector(state => state.user.userInfo);
  const {
    gameInfo,
    loading,
    error,
    playerOne,
    playerTwo,
    gameOver,
    winner,
    winnerPaid,
    connectedPlayers,
    rematchRequested,
    rematchRequestedBy,
    rematchWagerSize,
    rematchTimeControl
  } = useSelector(state => state.game);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchGameInfo(gameId));
    }
  }, [gameId, dispatch]);

  useEffect(() => {
    const websocket = new WebSocket(`${process.env.REACT_APP_WS_URL}?userId=${userInfo?.user_id}`);

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      switch (data.type) {
        case 'GAME_UPDATE':
          dispatch(updateGameState(data.gameState));
          break;
        case 'GAME_OVER':
          dispatch(setGameOver(true));
          dispatch(setWinner(data.winner));
          break;
        case 'WINNER_PAID':
          dispatch(setWinnerPaid(true));
          break;
        case 'REMATCH_REQUESTED':
          dispatch(setRematchRequested(true));
          dispatch(setRematchRequestedBy(data.from));
          dispatch(setRematchWagerSize(data.wagerSize));
          dispatch(setRematchTimeControl(data.timeControl));
          break;
        case 'PLAYER_CONNECTED':
        case 'PLAYER_DISCONNECTED':
        case 'PLAYER_STATUS_UPDATE':
          dispatch(fetchGameInfo(gameId));
          break;
        case 'PLAYER_INFO_UPDATE':
          dispatch(updatePlayerInfo(data.playerInfo));
          break;
        default:
          console.log('Unhandled websocket message:', data);
      }
    };

    return () => {
      websocket.close();
    };
  }, [dispatch, gameId, userInfo]);

  const handleJoinGame = () => {
    dispatch(joinGame({ gameId, userId: userInfo.user_id }));
  };

  const handleReportGameOver = () => {
    dispatch(reportGameOver(gameId));
  };

  const handleReportIssue = () => {
    dispatch(reportIssue(gameId));
  };

  const handleRematch = () => {
    dispatch(requestRematch({ gameId, userId: userInfo.user_id }));
  };

  const handleAcceptRematch = () => {
    dispatch(acceptRematch({ gameId, userId: userInfo.user_id }));
    dispatch(resetRematchState());
  };

  const handleDeclineRematch = () => {
    dispatch(declineRematch({ gameId, userId: userInfo.user_id }));
    dispatch(resetRematchState());
  };

  const handleCancelRematch = () => {
    dispatch(cancelRematch({ gameId, userId: userInfo.user_id }));
    dispatch(resetRematchState());
  };

  const renderRematchUI = () => {
    if (!userInfo) return null;

    if (rematchRequested && rematchRequestedBy !== userInfo.user_id) {
      return (
        <Box mt={2}>
          <Typography variant="body1">Your opponent has requested a rematch!</Typography>
          <Typography variant="body2">Wager: ${rematchWagerSize}, Time Control: {rematchTimeControl} seconds</Typography>
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

  if (!userInfo) {
    return <Typography>Loading user information...</Typography>;
  }

  if (loading) {
    return <Typography>Loading game information...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  if (!gameInfo) {
    return <Typography>No game information available.</Typography>;
  }

  const isGameComplete = gameInfo.state === "5";

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
            resetRematchState={() => dispatch(resetRematchState())}
          />
          {renderRematchUI()}
        </>
      )}
    </div>
  );
};

export default GamePage;
