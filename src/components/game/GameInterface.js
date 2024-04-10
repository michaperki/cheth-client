import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import MatchupPodium from './MatchUpPodium';
import NumberDisplay from './NumberDisplay';
import Web3 from 'web3';
import "./GameInterface.css";

const GameInterface = ({ gameInfo, playerOne, playerTwo, gameOver, winner, winnerPaid, onJoinGame }) => {
    return (
        <Box className="game-interface-container">
            <Typography variant="h3" className="game-title" >Game In-Progress</Typography>
            <Typography variant="h4" className="game-id" >Game ID: {gameInfo?.game_id}</Typography>
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
                        <Typography variant="h5" className="winner-announcement">
                            Winner: {winner} {winnerPaid && "(PAID)"}
                        </Typography>
                    )}
                    {!gameOver && (
                        <Button onClick={onJoinGame} className="join-game-button" variant="contained" color="primary">Join Game on Lichess</Button>
                    )}
                </>
            )}
        </Box>
    );
};

export default GameInterface;
