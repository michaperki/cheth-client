import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';

const WagerHistory = () => {
  const [games, setGames] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/getUserGames`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userInfo.user_id }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch game data');
        }
        const data = await response.json();
        setGames(data);

        // Calculate total earnings
        const earnings = data.reduce((total, game) => {
          if (game.winner === userInfo.user_id) {
            return total + parseFloat(game.reward_pool);
          } else if (game.winner === null) {
            return total; // Draw, no change
          } else {
            return total - parseFloat(game.wager);
          }
        }, 0);
        setTotalEarnings(earnings);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    if (userInfo) {
      fetchGames();
    }
  }, [userInfo]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Wager History</Typography>
      <Typography variant="h6" gutterBottom>Total Earnings: ${totalEarnings.toFixed(2)}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Opponent</TableCell>
              <TableCell>Wager</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Earnings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.game_id}>
                <TableCell>{format(new Date(game.created_at), 'MM/dd/yyyy HH:mm')}</TableCell>
                <TableCell>{game.player1_id === userInfo.user_id ? game.player2_id : game.player1_id}</TableCell>
                <TableCell>${parseFloat(game.wager).toFixed(2)}</TableCell>
                <TableCell>
                  {game.winner === userInfo.user_id ? 'Win' : game.winner === null ? 'Draw' : 'Loss'}
                </TableCell>
                <TableCell>
                  {game.winner === userInfo.user_id
                    ? `+$${parseFloat(game.reward_pool).toFixed(2)}`
                    : game.winner === null
                    ? '$0.00'
                    : `-$${parseFloat(game.wager).toFixed(2)}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WagerHistory;
