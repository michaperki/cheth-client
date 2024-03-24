import React from "react";
import { Box, Button, Tooltip, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

const GameTable = ({ gameData, cancelGame, finishGame, deleteGame, refreshContractBalance }) => {
    const theme = useTheme();
    
    // Define the mock data for games with truncated fields
    const mockDataGames = gameData.map((game, index) => ({
        id: index + 1,
        ...game,
    }));
    
    const handleCancelGame = (gameId) => {
        // Handle cancel game button click event
        console.log("Cancel Game clicked for row with ID:", gameId);
        cancelGame(gameId);
    };

    const handleFinishGame = (gameId) => {
        // Handle finish game button click event
        console.log("Finish Game clicked for row with ID:", gameId);
        finishGame(gameId);
    };

    const handleDeleteGame = (gameId) => {
        // Handle delete game button click event
        console.log("Delete Game clicked for row with ID:", gameId);
        deleteGame(gameId);
    };

    const handleRefreshContractBalance = (gameId) => {
        // Handle refresh contract balance button click event
        console.log("Refresh Contract Balance clicked for row with ID:", gameId);
        refreshContractBalance(gameId);
    };
        
    const abbreviateAddress = (address) => {
        return address ? `${address.substring(0, 2)}...${address.substring(address.length - 3)}` : null;
    };
    
    // Render cancel button with Clear icon
    const renderCancelButton = (params) => {
        return (
            <Tooltip title="Cancel Game">
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleCancelGame(params.row.game_id)}
                >
                    <ClearIcon />
                </Button>
            </Tooltip>
        );
    };

    // Render finish game button with Done icon
    const renderFinishButton = (params) => {
        return (
            <Tooltip title="Finish Game">
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleFinishGame(params.row.game_id)}
                >
                    <DoneIcon />
                </Button>
            </Tooltip>
        );
    };

    const renderDeleteButton = (params) => {
        return (
            <Tooltip title="Delete Game">
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteGame(params.row.game_id)}
                >
                    <DeleteIcon />
                </Button>
            </Tooltip>
        );
    };

    const renderRefreshButton = (params) => {
        return (
            <Tooltip title="Refresh Contract Balance">
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleRefreshContractBalance(params.row.game_id)}
                >
                    <RefreshIcon />
                </Button>
            </Tooltip>
        );
    }



    // Define columns for the data grid
    const columns = [
        { field: "game_id", headerName: "ID", flex: 0.5 },
        { field: "contract_address", headerName: "Address", flex: 0.5,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <span>{abbreviateAddress(params.value)}</span>
                </Tooltip>
            )
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
            field: "id", // Use an existing field
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <React.Fragment>
                    {renderCancelButton(params)}
                    {renderFinishButton(params)}
                    {renderDeleteButton(params)}
                    {renderRefreshButton(params)}
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
            </Box>
        </Box>
    );
}

export default GameTable;


