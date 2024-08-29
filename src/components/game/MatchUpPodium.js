import React from 'react';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import './MatchUpPodium.css';

const MatchupPodium = ({ playerOne, playerTwo, gameInfo, timeControl }) => {
    const isPlayerOneJoined = gameInfo?.player1_ready;
    const isPlayerTwoJoined = gameInfo?.player2_ready;
    const theme = useTheme();

    const getAvatarSrc = (avatar) => avatar && avatar !== 'none' ? `/icons/${avatar}` : '/icons/hoodie_blue.svg';

    const getRatingPropertyName = (timeControlValue) => {
        switch (timeControlValue) {
            case '60': return 'bullet_rating';
            case '180': case '300': return 'blitz_rating';
            default: return 'blitz_rating';
        }
    };

    const ratingProperty = getRatingPropertyName(timeControl);

    const PlayerCard = ({ player, isJoined, rating }) => (
        <Box className="player-card" sx={playerCardStyle(theme)}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{player?.username}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FiberManualRecordIcon sx={{ color: isJoined ? 'green' : 'grey', mr: 1, fontSize: 'small' }} />
                    {isJoined && <Chip label="Ready" color="success" size="small" />}
                </Box>
            </Box>
            <Avatar src={getAvatarSrc(player?.avatar)} alt={`${player?.username}'s avatar`} sx={{ width: 100, height: 100, mb: 1 }} />
            <Typography variant="body2">Rating: {rating}</Typography>
        </Box>
    );

    return (
        <Box className='matchup-podium-container'>
            <PlayerCard player={playerOne} isJoined={isPlayerOneJoined} rating={playerOne?.[ratingProperty]} />
            <SportsEsportsIcon sx={{ fontSize: 40, mx: 2, color: theme.palette.secondary.main }} />
            <PlayerCard player={playerTwo} isJoined={isPlayerTwoJoined} rating={playerTwo?.[ratingProperty]} />
        </Box>
    );
}

const playerCardStyle = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
    width: 200,
    height: 220,
    position: 'relative',
});

export default MatchupPodium;
