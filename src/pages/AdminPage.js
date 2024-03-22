import React, { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material'; // Import MUI components
import { useTheme } from '@mui/material/styles'; // Import useTheme hook

const AdminPage = () => {
    const theme = useTheme(); // Get the current theme
    const [unfinishedGames, setUnfinishedGames] = useState([]); // State to store unfinished games
    const [commissionStats, setCommissionStats] = useState({}); // State to store commission stats

    // Function to fetch unfinished games and commission stats
    const fetchAdminData = async () => {
        // Implement logic to fetch unfinished games and commission stats from your backend
        // Update state variables accordingly
    };

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        fetchAdminData();
    }, []);

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <div className={`min-h-screen flex flex-col justify-center items-center ${theme.palette.mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
                <div className="max-w-md w-full p-8 bg-white rounded shadow-lg dark:bg-gray-800 dark:text-white">
                    <Typography variant="h3" sx={{ mb: 4 }}>Admin Dashboard</Typography>
                    {/* Display Unfinished Games */}
                    <Typography variant="h5" sx={{ mb: 2 }}>Unfinished Games:</Typography>
                    <ul>
                        {unfinishedGames.map(game => (
                            <li key={game.id}>
                                {/* Display relevant information about each unfinished game */}
                            </li>
                        ))}
                    </ul>
                    {/* Display Commission Stats */}
                    <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Commission Stats:</Typography>
                    <div>
                        {/* Display relevant commission statistics */}
                    </div>
                    {/* Add Button or Controls for Admin Actions */}
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 4 }}
                        // Add onClick handler for any admin action, e.g., generate report
                    >
                        Generate Report
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default AdminPage;
