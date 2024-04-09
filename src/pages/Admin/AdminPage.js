import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEthereumPrice } from '../../contexts/EthereumPriceContext';
import { useWebSocket } from '../../hooks';
import StateBox from './StateBox';
import GameTable from './GameTable';
import CommissionBarChart from './CommissionBarChart';

const AdminPage = ({ userInfo }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [onlineUsersCount, setOnlineUsersCount] = useState(0);
    const [games, setGames] = useState([]);
    const [users, setUsers] = useState([]);
    const ethToUsdRate = useEthereumPrice();

    const handleWebSocketMessage = (message) => {
        console.log('Received message in AdminPage:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);

        if (messageData.type === "ONLINE_USERS_COUNT") {
            setOnlineUsersCount(messageData.count);
        }
    };

    const socket = useWebSocket(handleWebSocketMessage, userInfo?.userId, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/getUsers`);
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                console.log('Users:', data);
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);
    
    useEffect(() => {
      const fetchGames = async () => {
          try {
              const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getAllGames`);
              if (!response.ok) {
                  throw new Error('Failed to fetch games');
              }
              const data = await response.json();
              console.log('Games:', data);
              setGames(data);
          } catch (error) {
              console.error('Error fetching games:', error);
          }

      };

      fetchGames();
  }, []);

    const cancelGame = async (gameId) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/cancelGame`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameId }),
          });
          if (!response.ok) {
            throw new Error('Failed to cancel game');
          }
          // Update the games state after cancelling the game
          const updatedGames = games.filter((game) => game.id !== gameId);
          setGames(updatedGames);
        } catch (error) {
          console.error('Error cancelling game:', error);
        }
      };

      const finishGame = async (gameId) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/forceDraw`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameId }),
          });
          if (!response.ok) {
            throw new Error('Failed to finish game');
          }
          // Update the games state after finishing the game
          const updatedGames = games.filter((game) => game.id !== gameId);
          setGames(updatedGames);
        } catch (error) {
          console.error('Error finishing game:', error);
        }
      };

      const deleteGame = async (gameId) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/deleteGame`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameId }),
          });
          if (!response.ok) {
            throw new Error('Failed to delete game');
          }
          // Update the games state after deleting the game
          const updatedGames = games.filter((game) => game.id !== gameId);
          setGames(updatedGames);
        } catch (error) {
          console.error('Error deleting game:', error);
        }
      };

      const refreshContractBalance = async (gameId) => {
        // send the game id to the refresh contract balance endpoint
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/refreshContractBalance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameId }),
          });

          if (!response.ok) {
            throw new Error('Failed to refresh contract balances');
          }

          // fetch the games again to get the updated balances
          const responseGames = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getAllGames`);
          if (!responseGames.ok) {
            throw new Error('Failed to fetch games');
          }
          const data = await responseGames.json();
          console.log('Games:', data);
          setGames(data);

        } catch (error) {
          console.error('Error refreshing contract balances:', error);
        }
      }
        
    return (
        <div className={`max-w w-full p-8 rounded shadow-lg ${theme.palette.mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <Typography variant="h3" sx={{ mb: 4 }}>Admin Page</Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <StateBox title={onlineUsersCount} subtitle="Online Users" />
                <StateBox title={games.length} subtitle="Total Games" />
                <StateBox title={users.length} subtitle="Total Users" />
            </div>
            <CommissionBarChart gameData={games} ethToUsdRate={ethToUsdRate} />
            <GameTable gameData={games} cancelGame={cancelGame} finishGame={finishGame} deleteGame={deleteGame} refreshContractBalance={refreshContractBalance} />
            <Button variant="contained" className="mt-4" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
    );
}

export default AdminPage;