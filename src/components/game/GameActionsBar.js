import React from 'react';
import { Button, Box } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import "./GameActionsBar.css";

const GameActionsBar = ({
    gameOver,
    onReportGameOver,
    onReportIssue,
    onRematch,
    onAcceptRematch,
    onDeclineRematch,
    onCancelRematch
}) => {
    return (
        <Box className="game-actions-bar">
            {!gameOver && (
                <Button onClick={onReportGameOver} startIcon={<ReportProblemIcon />} >
                    Report Game Over
                </Button>
            )}
            <Button onClick={onReportIssue} startIcon={<ReportIcon />}>
                Report Issue
            </Button>
            {/* Other action buttons based on game state */}
        </Box>
    );
};

export default GameActionsBar;
