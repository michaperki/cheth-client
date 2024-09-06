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
} from 'store/slices/gameSlice';

const useGamePendingWebsocket = (gameId, userInfo) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const currentGame = useSelector(state => state.game.currentGame);
  const connectedPlayers = useSelector(state => state.game.connectedPlayers);
  const hasPlayerJoined = useSelector(state => state.game.hasPlayerJoined);

  const getGameInfo = useCallback(async () => {
    try {
      console.log('Fetching game info inside UseGamePendingWebsocket...');
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/${gameId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch game information');
      }
      const gameData = await response.json();
      console.log('Game data:', gameData);
      dispatch(setCurrentGame(gameData));

      const fetchPlayerData = async (playerId) => {
        const playerResponse = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${playerId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: playerId })
        });
        if (!playerResponse.ok) {
          throw new Error(`Failed to fetch player ${playerId} information`);
        }
        return playerResponse.json();
      };

      const [player1Data, player2Data] = await Promise.all([
        fetchPlayerData(gameData.player1_id),
        fetchPlayerData(gameData.player2_id)
      ]);

      dispatch(setPlayerOne(player1Data));
      dispatch(setPlayerTwo(player2Data));

      if (gameData && [2, 3].includes(parseInt(gameData.state))) {
        dispatch(setContractAddress(gameData.contract_address));
        dispatch(setContractBalance(gameData.reward_pool));
      }

      if (gameData && parseInt(gameData.state) === 4) {
        console.log('Game is primed. Navigating to game page...');
        navigate(`/game/${gameId}`);
      }
    } catch (error) {
      console.error('Error fetching game status:', error);
    }
  }, [gameId, dispatch, navigate]);

  const handleGamePendingPageWebSocketMessage = useCallback((message) => {
    console.log('Received message in GamePendingWebsocket:', message);
    const messageData = JSON.parse(message);
    console.log('messageData', messageData);

    switch (messageData.type) {
      case "GAME_JOINED":
        console.log("Switch case: GAME_JOINED");
        const newPlayerWallet = messageData.player;
        const hasJoined = newPlayerWallet === userInfo.wallet_address;
        dispatch(setHasPlayerJoined(hasJoined));
        break;
      case "GAME_PRIMED":
        console.log("Switch case: GAME_PRIMED");
        navigate(`/game/${gameId}`);
        break;
      case "PLAYER_CONNECTED":
      case "PLAYER_DISCONNECTED":
        console.log(`Switch case: ${messageData.type}`);
        dispatch(setConnectedPlayers([...new Set([...connectedPlayers, messageData.userId])]));
        break;
      case "PLAYER_STATUS_UPDATE":
        console.log("Switch case: PLAYER_STATUS_UPDATE");
        dispatch(setConnectedPlayers(messageData.players));
        break;
      default:
        console.log("Switch case: default");
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
