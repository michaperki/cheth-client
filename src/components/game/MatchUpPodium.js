import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './MatchUpPodium.css'; // Import the CSS file

const MatchupPodium = ({ playerOne, playerTwo, joinedPlayers = [] }) => {
    const playerOneID = playerOne.user_id;
    const playerTwoID = playerTwo.user_id;
    const isPlayerOneJoined = joinedPlayers?.includes(playerOneID);
    const isPlayerTwoJoined = joinedPlayers?.includes(playerTwoID);
    const theme = useTheme(); // Get the current theme

    const getAvatarSrc = (avatar) => avatar && avatar !== 'none' ? `/icons/${avatar}` : '/icons/duck.svg'; // Adjust the path to duck.svg as needed

    return (
        <Box className='matchup-podium-container'>
            <div className={`player-container ${isPlayerOneJoined ? 'ready' : ''}`}>
                <Box className={`player-box ${isPlayerOneJoined ? 'ready' : ''} ${theme.palette.mode}`}>
                    <img src={getAvatarSrc(playerOne.avatar)} alt={`${playerOne.username}'s avatar`} className="player-avatar" />
                    <Typography className="username" variant="subtitle1">{playerOne.username}</Typography>
                    <Typography className="rating" variant="body2">Rating: {playerOne.rating}</Typography>
                </Box>
                {isPlayerOneJoined && <Chip label="Ready!" color="success" />}
            </div>
            <Typography className="versus-text" variant="subtitle1">versus</Typography>
            <div className="player-container player-2">
                <Box className={`player-box ${isPlayerTwoJoined ? 'ready' : ''} ${theme.palette.mode}`}>
                    <img src={getAvatarSrc(playerTwo.avatar)} alt={`${playerTwo.username}'s avatar`} className="player-avatar" />
                    <Typography className="username" variant="subtitle1">{playerTwo.username}</Typography>
                    <Typography className="rating" variant="body2">Rating: {playerTwo.rating}</Typography>
                </Box>
                {isPlayerTwoJoined && <Chip label="Ready!" color="success" />}
            </div>
        </Box>
    );
}

export default MatchupPodium;
