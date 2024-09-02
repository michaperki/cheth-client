// src/components/GamePending/GamePendingContent.js

import React from "react";
import { useSelector } from "react-redux";
import { Button, Typography, Box } from "@mui/material";
import { NumberDisplay, MatchUpPodium } from "../game";
import Web3 from "web3";
import "./GamePendingContent.css";

const GamePendingContent = ({
  ethToUsdRate,
  hasPlayerJoined,
  joinGame,
  cancelGame,
}) => {
  const { currentGame: gameInfo, playerOne, playerTwo, connectedPlayers } = useSelector(state => state.game);
  const contractBalance = gameInfo?.reward_pool || "0";

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
