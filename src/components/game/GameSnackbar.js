import React from 'react';
import { Snackbar } from '@mui/material';

const GameSnackbar = ({ open, message, onClose }) => {
    return (
        <Snackbar
            open={open}
            message={message}
            onClose={onClose}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
    );
};

export default GameSnackbar;
