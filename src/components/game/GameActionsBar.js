import React from 'react';
import { Button, Box } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import RefreshIcon from '@mui/icons-material/Refresh';
import "./GameActionsBar.css";

const GameActionsBar = ({
    gameOver,
    onReportGameOver,
    onReportIssue,
    onRematch,
    onAcceptRematch,
    onDeclineRematch,
    onCancelRematch,
    rematchRequested,
    rematchRequestedBy,
    userInfo,
    resetRematchState
}) => {
    return (
        <Box className="game-actions-bar">
            {!gameOver && (
                <Button onClick={onReportGameOver} startIcon={<ReportProblemIcon />} variant="outlined" color="warning">
                    Report Game Over
                </Button>
            )}
            <Button onClick={onReportIssue} startIcon={<ReportIcon />} variant="outlined" color="error">
                Report Issue
            </Button>
            {gameOver && !rematchRequested && (
                <Button onClick={onRematch} startIcon={<RefreshIcon />} variant="contained" color="primary">
                    Request Rematch
                </Button>
            )}
            {rematchRequested && rematchRequestedBy !== userInfo.user_id && (
                <>
                    <Button onClick={() => { onAcceptRematch(); resetRematchState(); }} variant="contained" color="success">
                        Accept Rematch
                    </Button>
                    <Button onClick={() => { onDeclineRematch(); resetRematchState(); }} variant="contained" color="error">
                        Decline Rematch
                    </Button>
                </>
            )}
            {rematchRequested && rematchRequestedBy === userInfo.user_id && (
                <Button onClick={() => { onCancelRematch(); resetRematchState(); }} variant="contained" color="warning">
                    Cancel Rematch Request
                </Button>
            )}
        </Box>
    );
};

export default GameActionsBar;
