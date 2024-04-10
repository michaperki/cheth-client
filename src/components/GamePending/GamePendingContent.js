import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import NumberDisplay from '../../components/game/NumberDisplay';
import MatchupPodium from '../../components/game/MatchUpPodium';
import Web3 from 'web3';
import './GamePendingContent.css'; // Import your CSS file

const GamePendingContent = ({
  gameInfo,
  player_one,
  player_two,
  contractBalance,
  ethToUsdRate,
  hasPlayerJoined,
  joinGame,
  cancelGame
}) => {
    return (
        <Box className="game-pending-content">
            <Typography variant="h3" className="game-pending-title">Game Pending</Typography>
            <Typography className="game-id">Game ID: {gameInfo.game_id}</Typography>


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
                <Typography className="waiting-message">Waiting for opponent to join</Typography>
            ) : (
                <Button onClick={joinGame} variant="contained" color="primary" className="game-pending-button">
                    Join Game
                </Button>
            )}

            <Button onClick={cancelGame} variant="contained" color="error" className="game-pending-button">
                Cancel Game
            </Button>
        </Box>
    );
};

export default GamePendingContent;
