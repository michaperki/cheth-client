import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import './MatchUpPodium.css'

const MatchupPodium = ({ winner }) => {
    const theme = useTheme();
    const { playerOne, playerTwo, currentGame: gameInfo, connectedPlayers = [] } = useSelector(state => state.game);
    const timeControl = gameInfo?.time_control;

    const getAvatarSrc = (avatar) => avatar && avatar !== 'none' ? `/icons/${avatar}` : '/icons/hoodie_blue.svg';

    const getRatingPropertyName = (timeControlValue) => {
        switch (timeControlValue) {
            case '60': return 'bullet_rating';
            case '180': case '300': return 'blitz_rating';
            default: return 'blitz_rating';
        }
    };

    const ratingProperty = getRatingPropertyName(timeControl);

    const PlayerCard = ({ player, isReady, rating, isWinner }) => {
        const isConnected = player && connectedPlayers.includes(player.user_id);

        return (
            <Box sx={{
                ...playerCardStyle(theme),
                border: isWinner ? `2px solid ${theme.palette.success.main}` : 'none',
                boxShadow: isWinner ? `0 0 10px ${theme.palette.success.main}` : theme.shadows[3],
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{player?.username || 'Unknown'}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FiberManualRecordIcon sx={{ color: isConnected ? 'green' : 'grey', mr: 1, fontSize: 'small' }} />
                        {isReady && <Chip label="Ready" color="success" size="small" />}
                        {isWinner && <EmojiEventsIcon sx={{ color: theme.palette.warning.main, ml: 1 }} />}
                    </Box>
                </Box>
                <Avatar src={getAvatarSrc(player?.avatar)} alt={`${player?.username || 'Unknown'}'s avatar`} sx={{ width: 100, height: 100, mb: 1 }} />
                <Typography variant="body2">Rating: {rating || 'N/A'}</Typography>
            </Box>
        );
    };

    return (
        <Box className='matchup-podium-container'>
            <PlayerCard 
                player={playerOne} 
                isReady={gameInfo?.player1_ready} 
                rating={playerOne?.[ratingProperty]}
                isWinner={winner === playerOne?.username}
            />
            <SportsEsportsIcon sx={{ fontSize: 40, mx: 2, color: theme.palette.secondary.main }} />
            <PlayerCard 
                player={playerTwo} 
                isReady={gameInfo?.player2_ready} 
                rating={playerTwo?.[ratingProperty]}
                isWinner={winner === playerTwo?.username}
            />
        </Box>
    );
}

const playerCardStyle = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    width: 200,
    height: 220,
    position: 'relative',
});

export default MatchupPodium;
