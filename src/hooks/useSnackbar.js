    // hooks/useDashboardPageWebSocket.js
    import { useState } from 'react';


    const useSnackbar = () => {
        const [snackbarOpen, setSnackbarOpen] = useState(false);
        const [snackbarMessage, setSnackbarMessage] = useState('');

        const handleSnackbarClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }
            setSnackbarOpen(false); // Use the state updater function
        }

        return { snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, handleSnackbarClose };
    };

    export default useSnackbar;