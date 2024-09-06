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
        console.log('Games:', data);

        // Calculate total earnings
        const earnings = data.reduce((total, game) => {
          if (parseInt(game.state) < 3) {
            return total; // Game was aborted, no change in earnings
          }

          const rewardPoolInUsd = weiToUsd(game.reward_pool);
          
          if (game.winner === userInfo.user_id) {
            return total + rewardPoolInUsd;
          } else if (game.winner === null) {
            return total; // Draw, no change
          } else {
            return total - game.wager;
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
    return parseFloat((parseFloat(ethAmount) * ethToUsdRate).toFixed(2));
  };

  const getOpponentUsername = (game) => {
    return game.player1_id === userInfo.user_id ? game.player2_username : game.player1_username;
  };

  const getGameResult = (game) => {
    if (parseInt(game.state) < 3) {
      return 'Aborted';
    }
    if (game.winner === userInfo.user_id) {
      return 'Win';
    }
    if (game.winner === null) {
      return 'Draw';
    }
    return 'Loss';
  };

  const getEarnings = (game) => {
    if (parseInt(game.state) < 3) {
      return '$0.00';
    }
    if (game.winner === userInfo.user_id) {
      return `+$${weiToUsd(game.reward_pool).toFixed(2)}`;
    }
    if (game.winner === null) {
      return '$0.00';
    }
    return `-$${weiToUsd(game.wager).toFixed(2)}`;
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
                <TableCell>{getOpponentUsername(game)}</TableCell>
                <TableCell>${parseFloat(game.wager).toFixed(2)}</TableCell>
                <TableCell>{getGameResult(game)}</TableCell>
                <TableCell>{getEarnings(game)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WagerHistory;
