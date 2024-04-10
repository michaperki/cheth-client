import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import BulletIcon from '@mui/icons-material/Whatshot'; // Example icon for Bullet
import BlitzIcon from '@mui/icons-material/FlashOn'; // Example icon for Blitz
import RapidIcon from '@mui/icons-material/Timer'; // Example icon for Rapid

const RatingsDisplay = ({ userInfo, selectedTimeControl }) => {
    const ratingTypes = [
        { type: 'bullet', icon: <BulletIcon /> },
        { type: 'blitz', icon: <BlitzIcon /> },
        { type: 'rapid', icon: <RapidIcon /> },
    ];

    const highlightRating = (type) => {
        if ((selectedTimeControl === '60' && type === 'bullet') || 
            ((selectedTimeControl === '180' || selectedTimeControl === '300') && type === 'blitz')) {
            return true;
        }
        return false;
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            {ratingTypes.map(({ type, icon }) => (
                <Card 
                key={type} 
                sx={{ minWidth: 100, textAlign: 'center', 
                border: highlightRating(type) ? '2px solid #1976d2' : '2px solid transparent'

                }}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            {icon}
                            {' '}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {userInfo ? userInfo[`${type}_rating`] : 'N/A'}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default RatingsDisplay;
