import React from "react";
import { Modal, Typography, Button } from "@mui/material";
import "./popup.css";
import { useTheme } from "@mui/material/styles";

const GameDetailPopup = ({ open, onClose, game, onResolveGame }) => {
  const theme = useTheme();

  const handleResolve = (winner) => {
    onResolveGame(game?.game_id, winner);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="popup-container popup"
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="h5" className="popup-header">
          Game Details
        </Typography>
        <div className="popup-content">
          <Typography>ID: {game?.game_id}</Typography>
          <Typography>Contract Address: {game?.contract_address}</Typography>
          <Typography>Player 1 ID: {game?.player1_id}</Typography>
          <Typography>Player 2 ID: {game?.player2_id}</Typography>
          <Typography>State: {game?.state}</Typography>
          <Typography>Winner: {game?.winner}</Typography>
          <Typography>Reward Pool: {game?.reward_pool}</Typography>
          <Typography>Lichess ID: {game?.lichess_id}</Typography>
          <Typography>
            Player 1 Ready: {game?.player1_ready ? "Yes" : "No"}
          </Typography>
          <Typography>
            Player 2 Ready: {game?.player2_ready ? "Yes" : "No"}
          </Typography>
          <Typography>Player 1 Payout: {game?.player1_payout}</Typography>
          <Typography>Player 2 Payout: {game?.player2_payout}</Typography>
          <Typography>Commission: {game?.commission}</Typography>
          <Typography>Time Control: {game?.time_control}</Typography>
          <Typography>Wager: {game?.wager}</Typography>
          <Typography>
            Rematch Requested: {game?.rematch_requested ? "Yes" : "No"}
          </Typography>
          <Typography>
            Rematch Requested By:{" "}
            {game?.rematch_requested_by ? game?.rematch_requested_by : "N/A"}
          </Typography>
          <Typography>
            Rematch Accepted: {game?.rematch_accepted ? "Yes" : "No"}
          </Typography>
          <Typography>
            Rematch Declined: {game?.rematch_declined ? "Yes" : "No"}
          </Typography>
          <Typography>Created At: {game?.created_at}</Typography>
          <Typography>Updated At: {game?.updated_at}</Typography>
        </div>
        {parseInt(game?.state) === -2 && (
          <div className="popup-actions">
            <Button
              variant="contained"
              onClick={() => handleResolve(game?.player1_id)}
              className="popup-button"
            >
              Resolve for Player 1
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                handleResolve("0x0000000000000000000000000000000000000000")
              }
              className="popup-button"
            >
              Draw
            </Button>
            <Button
              variant="contained"
              onClick={() => handleResolve(game?.player2_id)}
              className="popup-button"
            >
              Resolve for Player 2
            </Button>
          </div>
        )}
        <Button onClick={onClose} className="popup-button">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default GameDetailPopup;
