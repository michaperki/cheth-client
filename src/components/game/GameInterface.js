// src/components/game/GameInterface.js

import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box, Button } from '@mui/material';
import MatchupPodium from './MatchUpPodium';
import NumberDisplay from './NumberDisplay';
import Web3 from 'web3';
import "./GameInterface.css";

const GameInterface = ({ gameOver, winner, winnerPaid, onJoinGame, ethToUsdRate }) => {
    const { currentGame: gameInfo } = useSelector(state => state.game);

    return (
        <Box className="game-interface-container">
            <Typography variant="h3" className="game-title" >Game In-Progress</Typography>
            <Typography variant="h4" className="game-id" >Game ID: {gameInfo?.game_id}</Typography>
            {gameInfo && (
                <>
                    <MatchupPodium />
                    <NumberDisplay 
                        amount={Web3.utils.fromWei(gameInfo.reward_pool, 'ether') * ethToUsdRate}
                    />
                    {gameOver && (
                        <Typography variant="h5" className="winner-announcement">
                            Winner: {winner} {winnerPaid && "(PAID)"}
                        </Typography>
                    )}
                    {!gameOver && (
                        <Button onClick={onJoinGame} className="join-game-button" variant="contained" color="primary">
                            Join Game on Lichess
                        </Button>
                    )}
                </>
            )}
        </Box>
    );
};

export default GameInterface;
