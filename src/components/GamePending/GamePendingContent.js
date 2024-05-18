import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { NumberDisplay, MatchUpPodium } from "../game";
import Web3 from "web3";
import "./GamePendingContent.css"; // Import your CSS file

const GamePendingContent = ({
  gameInfo,
  player_one,
  player_two,
  contractBalance,
  ethToUsdRate,
  hasPlayerJoined,
  joinGame,
  cancelGame,
}) => {
  return (
    <Box className="game-pending-content">
      <Typography variant="h3" className="game-pending-title">
        Game Pending
      </Typography>
      <Typography className="game-id">Game ID: {gameInfo.game_id}</Typography>

      {player_one && player_two && gameInfo.time_control && (
        <Box sx={{ marginBottom: 3 }}>
          <MatchUpPodium
            playerOne={player_one}
            playerTwo={player_two}
            gameInfo={gameInfo}
            timeControl={gameInfo.time_control}
          />
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
