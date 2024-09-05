// src/components/GamePending/GamePendingContent.js

import React from "react";
import { useSelector } from "react-redux";
import { Button, Typography, Box } from "@mui/material";
import { NumberDisplay, MatchUpPodium } from "components/game";
import Web3 from "web3";
import "./GamePendingContent.css";

const GamePendingContent = ({
  ethToUsdRate,
  joinGame,
  cancelGame,
}) => {
  const gameInfo = useSelector(state => state.game.currentGame);
  const playerOne = useSelector(state => state.game.playerOne);
  const playerTwo = useSelector(state => state.game.playerTwo);
  const hasPlayerJoined = useSelector(state => state.game.hasPlayerJoined);
  const contractBalance = useSelector(state => state.game.contractBalance);

  return (
    <Box className="game-pending-content">
      <Typography variant="h3" className="game-pending-title">
        Game Pending
      </Typography>
      <Typography className="game-id">Game ID: {gameInfo?.game_id}</Typography>

      {playerOne && playerTwo && gameInfo?.time_control && (
        <Box sx={{ marginBottom: 3 }}>
          <MatchUpPodium />
        </Box>
      )}

      <NumberDisplay
        amount={Web3.utils.fromWei(contractBalance, "ether") * ethToUsdRate}
      />

      {hasPlayerJoined ? (
        <Typography className="waiting-message">
          Waiting for opponent to join
        </Typography>
      ) : (
        <Box className="button-container">
          <Button
            onClick={joinGame}
            variant="contained"
            color="primary"
            className="game-pending-button"
          >
            Join Game
          </Button>
          <Button
            onClick={cancelGame}
            variant="contained"
            color="error"
            className="game-pending-button"
          >
            Cancel Game
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GamePendingContent;
