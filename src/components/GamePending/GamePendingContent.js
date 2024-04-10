import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import NumberDisplay from '../../components/game/NumberDisplay';
import MatchupPodium from '../../components/game/MatchUpPodium';
import Web3 from 'web3';

const GamePendingContent = ({
  gameInfo,
  gameState,
  player_one,
  player_two,
  contractBalance,
  ethToUsdRate,
  hasPlayerJoined,
  joinGame,
  cancelGame
}) => {
    return (
        <Box>
            <Typography variant="h3" sx={{ mb: 4 }}>Game Pending</Typography>
            <Typography sx={{ mb: 2 }}>Game ID: {gameInfo.game_id}</Typography>

            {player_one && player_two && gameInfo.time_control && (
                <Box sx={{ marginBottom: 3 }}>
                    <MatchupPodium 
                        playerOne={player_one} 
                        playerTwo={player_two} 
                        joinedPlayers={[player_one.id, player_two.id]} 
                        timeControl={gameInfo.time_control} 
                    />
                </Box>
            )}
            
            <NumberDisplay amount={Web3.utils.fromWei(contractBalance, 'ether') * ethToUsdRate} />

            {hasPlayerJoined ? (
                <Typography sx={{ mb: 2 }}>Waiting for opponent to join</Typography>
            ) : (
                <Button onClick={joinGame} variant="contained" color="primary" sx={{ '&:hover': { bgcolor: 'primary.dark' }, mr: 2 }}>
                    Join Game
                </Button>
            )}

            <Button onClick={cancelGame} variant="contained" color="error" sx={{ '&:hover': { bgcolor: 'error.dark' } }}>
                Cancel Game
            </Button>
        </Box>
    );
};

export default GamePendingContent;
