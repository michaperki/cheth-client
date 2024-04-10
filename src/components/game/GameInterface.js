import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import MatchupPodium from './MatchUpPodium';
import NumberDisplay from './NumberDisplay';
import Web3 from 'web3';

const GameInterface = ({ gameInfo, playerOne, playerTwo, gameOver, winner, winnerPaid, onJoinGame }) => {
    return (
        <Box>
            <Typography variant="h3" sx={{ mb: 4 }}>Game In-Progress</Typography>
            <Typography variant="h4" sx={{ mb: 2 }}>Game ID: {gameInfo?.game_id}</Typography>
            {gameInfo && (
                <>
                    <MatchupPodium 
                        playerOne={playerOne} 
                        playerTwo={playerTwo}
                        gameInfo={gameInfo}
                        timeControl={gameInfo.time_control} 
                    />
                    <NumberDisplay 
                        amount={Web3.utils.fromWei(gameInfo.reward_pool, 'ether')}
                    />
                    {gameOver && (
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Winner: {winner} {winnerPaid && "(PAID)"}
                        </Typography>
                    )}
                    {!gameOver && (
                        <Button onClick={onJoinGame}>Join Game on Lichess</Button>
                    )}
                </>
            )}
        </Box>
    );
};

export default GameInterface;
