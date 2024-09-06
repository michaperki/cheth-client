import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWebSocket from './useWebsocket';
import {
  setCurrentGame,
  setPlayerOne,
  setPlayerTwo,
  setConnectedPlayers,
  setHasPlayerJoined,
  setContractAddress,
  setContractBalance,
} from '../../store/slices/gameSlice';

const useGamePendingWebsocket = (gameId, userInfo) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const currentGame = useSelector(state => state.game.currentGame);
  const connectedPlayers = useSelector(state => state.game.connectedPlayers);
  const hasPlayerJoined = useSelector(state => state.game.hasPlayerJoined);

  const getGameInfo = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/${gameId}`);
      if (!response.ok) throw new Error('Failed to fetch game information');
      
      const gameData = await response.json();
      dispatch(setCurrentGame(gameData));

      if (gameData.player1_id && !currentGame?.playerOne) {
        fetchPlayerData(gameData.player1_id, setPlayerOne);
      }
      if (gameData.player2_id && !currentGame?.playerTwo) {
        fetchPlayerData(gameData.player2_id, setPlayerTwo);
      }

      if (gameData && [2, 3].includes(parseInt(gameData.state))) {
        dispatch(setContractAddress(gameData.contract_address));
        dispatch(setContractBalance(gameData.reward_pool));
      }

      if (gameData && parseInt(gameData.state) === 4) {
        navigate(`/game/${gameId}`);
      }
    } catch (error) {
      console.error('Error fetching game status:', error);
    }
  }, [gameId, dispatch, navigate, currentGame]);

  const fetchPlayerData = useCallback(async (playerId, setPlayerInfo) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${playerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: playerId })
      });
      if (!response.ok) throw new Error(`Failed to fetch player ${playerId} information`);
      const data = await response.json();
      dispatch(setPlayerInfo(data));
    } catch (error) {
      console.error('Error fetching player information:', error);
    }
  }, [dispatch]);

  const handleGamePendingPageWebSocketMessage = useCallback((message) => {
    const messageData = JSON.parse(message);

    switch (messageData.type) {
      case "GAME_JOINED":
        dispatch(setHasPlayerJoined(messageData.player === userInfo.wallet_address));
        break;
      case "GAME_PRIMED":
        navigate(`/game/${gameId}`);
        break;
      case "PLAYER_CONNECTED":
      case "PLAYER_DISCONNECTED":
        dispatch(setConnectedPlayers([...new Set([...connectedPlayers, messageData.userId])]));
        break;
      case "PLAYER_STATUS_UPDATE":
        dispatch(setConnectedPlayers(messageData.players));
        break;
      default:
        break;
    }

    getGameInfo();
  }, [dispatch, navigate, gameId, userInfo, connectedPlayers, getGameInfo]);

  const { socket } = useWebSocket(handleGamePendingPageWebSocketMessage, userInfo?.user_id, []);

  useEffect(() => {
    getGameInfo();
  }, [getGameInfo]);

  return {
    getGameInfo,
    socket,
  };
};

export default useGamePendingWebsocket;
