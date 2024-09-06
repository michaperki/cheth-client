import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useEthereumPrice } from 'contexts/EthereumPriceContext';
import Web3 from 'web3';

const WagerHistory = () => {
  const [games, setGames] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const userInfo = useSelector((state) => state.user.userInfo);
  const ethToUsdRate = useEthereumPrice();

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
          const wagerInEth = Web3.utils.fromWei(game.wager, 'ether');
          const rewardPoolInEth = Web3.utils.fromWei(game.reward_pool, 'ether');
          
          if (game.winner === userInfo.user_id) {
            return total + (parseFloat(rewardPoolInEth) * ethToUsdRate);
          } else if (game.winner === null) {
            return total; // Draw, no change
          } else {
            return total - (parseFloat(wagerInEth) * ethToUsdRate);
          }
        }, 0);
        setTotalEarnings(earnings);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    if (userInfo && ethToUsdRate > 0) {
      fetchGames();
    }
  }, [userInfo, ethToUsdRate]);

  const weiToUsd = (weiAmount) => {
    const ethAmount = Web3.utils.fromWei(weiAmount, 'ether');
    return (parseFloat(ethAmount) * ethToUsdRate).toFixed(2);
  };

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
              <TableCell>Wager (USD)</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Earnings (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.game_id}>
                <TableCell>{format(new Date(game.created_at), 'MM/dd/yyyy HH:mm')}</TableCell>
                <TableCell>
                  {game.player1_id === userInfo.user_id ? game.player2_username : game.player1_username}
                </TableCell>
                <TableCell>${weiToUsd(game.wager)}</TableCell>
                <TableCell>
                  {game.winner === userInfo.user_id ? 'Win' : game.winner === null ? 'Draw' : 'Loss'}
                </TableCell>
                <TableCell>
                  {game.winner === userInfo.user_id
                    ? `+$${weiToUsd(game.reward_pool)}`
                    : game.winner === null
                    ? '$0.00'
                    : `-$${weiToUsd(game.wager)}`}
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
