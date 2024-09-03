import React, { useState } from "react";
import { Box, Tooltip, useTheme, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import GameDetailPopup from "./GameDetailPopup";

const GameTable = ({
  gameData,
  cancelGame,
  finishGame,
  deleteGame,
  refreshContractBalance,
  resolveGame,
}) => {
  const theme = useTheme();
  const [selectedGame, setSelectedGame] = useState(null);

  const mockDataGames = gameData.map((game, index) => ({
    id: index + 1,
    ...game,
  }));

  const handleCancelGame = (gameId) => {
    console.log("Cancel Game clicked for row with ID:", gameId);
    cancelGame(gameId);
  };

  const handleFinishGame = (gameId) => {
    console.log("Finish Game clicked for row with ID:", gameId);
    finishGame(gameId);
  };

  const handleDeleteGame = (gameId) => {
    console.log("Delete Game clicked for row with ID:", gameId);
    deleteGame(gameId);
  };

  const handleRefreshContractBalance = (gameId) => {
    console.log("Refresh Contract Balance clicked for row with ID:", gameId);
    refreshContractBalance(gameId);
  };

  const handleResolveGame = (gameId, winner) => {
    console.log(
      "Resolve Game clicked for row with ID:",
      gameId,
      "with winner:",
      winner,
    );
    resolveGame(gameId, winner);
  };

  const handleOpenGameDetails = (gameId) => {
    console.log("Open Game Details clicked for row with ID:", gameId);
    // Handle opening game details here

    const game = gameData.find((game) => game.game_id === gameId);
    console.log("Selected game:", game);

    setSelectedGame(game);
  };

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
  };

  const abbreviateAddress = (address) => {
    return address
      ? `${address.substring(0, 2)}...${address.substring(address.length - 3)}`
      : null;
  };

  const renderCancelButton = (params) => {
    return (
      <Tooltip title="Cancel Game">
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleCancelGame(params.row.game_id)}
        >
          <ClearIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const renderFinishButton = (params) => {
    return (
      <Tooltip title="Finish Game">
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleFinishGame(params.row.game_id)}
        >
          <DoneIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const renderDeleteButton = (params) => {
    return (
      <Tooltip title="Delete Game">
        <IconButton
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDeleteGame(params.row.game_id)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const renderRefreshButton = (params) => {
    return (
      <Tooltip title="Refresh Contract Balance">
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleRefreshContractBalance(params.row.game_id)}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const renderGameDetailsButton = (params) => {
    return (
      <Tooltip title="Game Details">
        <IconButton
          color="primary"
          onClick={() => handleOpenGameDetails(params.row.game_id)}
        >
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const handleClosePopup = () => {
    setSelectedGame(null);
  };

  const columns = [
    { field: "game_id", headerName: "ID", flex: 0.25 },
    {
      field: "contract_address",
      headerName: "Address",
      flex: 0.25,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Tooltip title={params.value}>
            <span>{abbreviateAddress(params.value)}</span>
          </Tooltip>
          <IconButton
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleCopyAddress(params.value)}
            sx={{ marginLeft: "auto", minWidth: "unset" }}
          >
            <ContentCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    { field: "player1_id", headerName: "P1", flex: 0.25 },
    { field: "player2_id", headerName: "P2", flex: 0.25 },
    { field: "state", headerName: "State", flex: 0.25 },
    { field: "winner", headerName: "Winner", flex: 0.25 },
    { field: "reward_pool", headerName: "Prize", flex: 0.25 },
    { field: "lichess_id", headerName: "Lichess ID", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.25 },
    { field: "updated_at", headerName: "Updated At", flex: 0.25 },
    {
      field: "id",
      headerName: "Actions",
      flex: 0.8,
      renderCell: (params) => (
        <React.Fragment>
          {renderCancelButton(params)}
          {renderFinishButton(params)}
          {renderDeleteButton(params)}
          {renderRefreshButton(params)}
          {renderGameDetailsButton(params)}
        </React.Fragment>
      ),
      disableClickEventBubbling: true,
    },
  ];

  return (
    <Box m="20px">
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            "& .MuiDataGrid-columnsContainer": {
              backgroundColor: theme.palette.background.paper,
            },
            "& .MuiDataGrid-cell": {
              borderRight: `1px solid ${theme.palette.divider}`,
            },
            "& .MuiDataGrid-row": {
              border: `1px solid ${theme.palette.divider}`,
            },
          },
        }}
      >
        <DataGrid
          rows={mockDataGames}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
        <GameDetailPopup
          open={selectedGame !== null}
          onClose={handleClosePopup}
          game={selectedGame}
          onResolveGame={handleResolveGame}
        />
      </Box>
    </Box>
  );
};

export default GameTable;
