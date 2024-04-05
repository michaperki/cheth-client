import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'; // Icon for "Versus"
import './MatchUpPodium.css'; // Import the CSS file

const MatchupPodium = ({ playerOne, playerTwo, joinedPlayers = [], timeControl }) => {
    const playerOneID = playerOne.user_id;
    const playerTwoID = playerTwo.user_id;
    const isPlayerOneJoined = joinedPlayers?.includes(playerOneID);
    const isPlayerTwoJoined = joinedPlayers?.includes(playerTwoID);
    const theme = useTheme(); // Get the current theme

    const getAvatarSrc = (avatar) => avatar && avatar !== 'none' ? `/icons/${avatar}` : '/icons/hoodie_blue.svg'; // Adjust the path to duck.svg as needed

    // Function to get the correct rating property name based on time control
    const getRatingPropertyName = (timeControlValue) => {
        switch (timeControlValue) {
            case '60': return 'bullet_rating';
            case '180': return 'blitz_rating';
            case '300': return 'blitz_rating';
            default: return 'blitz_rating'; // default or any other time control
        }
    };

    // Get the property name for the current time control
    const ratingProperty = getRatingPropertyName(timeControl);
    console.log('ratingProperty:', ratingProperty);
    console.log('timeControl:', timeControl);

    const playerOneRating = playerOne[ratingProperty] || 'N/A';
    const playerTwoRating = playerTwo[ratingProperty] || 'N/A';

    return (
        <Box className='matchup-podium-container'>
            {/* Player One */}
            <Box className={`player-box ${isPlayerOneJoined ? 'ready' : ''}`} sx={playerBoxStyle(isPlayerOneJoined, theme)}>
                <img src={getAvatarSrc(playerOne.avatar)} alt={`${playerOne.username}'s avatar`} className="player-avatar" />
                <Typography className="username" variant="subtitle1" sx={{ color: theme.palette.text.primary }}>{playerOne.username}</Typography>
                <Typography className="rating" variant="body2">Rating: {playerOneRating}</Typography>
                {isPlayerOneJoined && <Chip label="Ready!" color="success" />}
            </Box>

            {/* Versus Icon */}
            <SportsEsportsIcon sx={{ fontSize: 40, mx: 2, color: theme.palette.secondary.main }} />

            {/* Player Two */}
            <Box className={`player-box ${isPlayerTwoJoined ? 'ready' : ''}`} sx={playerBoxStyle(isPlayerTwoJoined, theme)}>
                <img src={getAvatarSrc(playerTwo.avatar)} alt={`${playerTwo.username}'s avatar`} className="player-avatar" />
                <Typography className="username" variant="subtitle1" sx={{ color: theme.palette.text.primary }}>{playerTwo.username}</Typography>
                <Typography className="rating" variant="body2">Rating: {playerTwoRating}</Typography>
                {isPlayerTwoJoined && <Chip label="Ready!" color="success" />}
            </Box>
        </Box>
    );
}

// Helper function for styling player boxes
const playerBoxStyle = (isJoined, theme) => ({
    boxShadow: theme.palette.mode === 'dark' ? '0px 2px 5px rgba(255, 255, 255, 0.2)' : '0px 2px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    background: isJoined ? theme.palette.success.main : theme.palette.background.paper,
    color: isJoined ? theme.palette.common.white : theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    mx: 1,
    width: 200,
    '& .player-avatar': {
        width: 150,
        height: 150,
        mb: 1,
        borderRadius: '50%',
        border: `3px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.mode === 'dark' ? '#f5f5f5' : '#424242', // Light gray for dark mode, dark for light mode
    }
});

export default MatchupPodium;
