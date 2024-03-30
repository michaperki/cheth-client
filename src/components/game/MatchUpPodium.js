import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const MatchupPodium = ({ playerOne, playerTwo, joinedPlayers }) => {
    console.log("in the MatchupPodium component");
    console.log("joinedPlayers: ", joinedPlayers);

    // Normalize joinedPlayers array
    const normalizedJoinedPlayers = joinedPlayers.map(player => player.toLowerCase());

    console.log("normalizedJoinedPlayers: ", normalizedJoinedPlayers);

    const playerOneAddress = playerOne.wallet_address.toLowerCase();
    const playerTwoAddress = playerTwo.wallet_address.toLowerCase();

    console.log("playerOneAddress: ", playerOneAddress);
    console.log("playerTwoAddress: ", playerTwoAddress);

    const isPlayerOneJoined = normalizedJoinedPlayers.includes(playerOneAddress);
    const isPlayerTwoJoined = normalizedJoinedPlayers.includes(playerTwoAddress);

    console.log("isPlayerOneJoined: ", isPlayerOneJoined);
    console.log("isPlayerTwoJoined: ", isPlayerTwoJoined);

    const theme = useTheme(); // Get the current theme

    return (
        <Box
            sx={{
                display: 'flex',
                mb: 2,
            }}
        >
            <div style={{ width: 200 }}> {/* Adjust the width as per your requirement */}
                <Box
                    sx={{
                        border: '1px solid',
                        borderColor: isPlayerOneJoined ? 'primary.main' : 'black',
                        borderRadius: 1,
                        p: 1,
                        mr: 2,
                        bgcolor: isPlayerOneJoined ? 'primary.light' : 'inherit',
                        boxShadow: theme.palette.mode === 'dark' ? '0px 2px 5px rgba(255, 255, 255, 0.2)' : '0px 2px 5px rgba(0, 0, 0, 0.2)'

                    }}
                >
                    <Typography variant="subtitle1">{playerOne.username}</Typography>
                    <Typography variant="body2">Rating: {playerOne.rating}</Typography>
                </Box>
                {isPlayerOneJoined && <Chip label="Ready!" color="success" />}
            </div>
            <Typography variant="subtitle1" sx={{ my: 2, mx: 3 }}>versus</Typography>
            <div style={{ width: 200 }}> {/* Adjust the width as per your requirement */}
                <Box
                    sx={{
                        border: '1px solid',
                        borderColor: isPlayerTwoJoined ? 'primary.main' : 'black',
                        borderRadius: 1,
                        p: 1,
                        bgcolor: isPlayerTwoJoined ? 'primary.light' : 'inherit',
                        color: isPlayerTwoJoined ? 'primary.dark' : 'inherit',
                        boxShadow: theme.palette.mode === 'dark' ? '0px 2px 5px rgba(255, 255, 255, 0.2)' : '0px 2px 5px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    <Typography variant="subtitle1">{playerTwo.username}</Typography>
                    <Typography variant="body2">Rating: {playerTwo.rating}</Typography>
                </Box>
                {isPlayerTwoJoined && <Chip label="Ready!" color="success" />}
            </div>
        </Box>
    );
}

export default MatchupPodium;
