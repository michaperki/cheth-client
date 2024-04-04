import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Button, Grid, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const AvatarSelection = ({ userInfo }) => {
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(userInfo.avatar);
    const [isSaveEnabled, setSaveEnabled] = useState(false);

    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/allIcons`);
                if (!response.ok) {
                    throw new Error('Failed to fetch avatars');
                }
                const avatarFiles = await response.json();
                setAvatars(avatarFiles.icons);
            } catch (error) {
                console.error('Error fetching avatars:', error);
            }
        };

        fetchAvatars();
    }, []);

    const handleAvatarClick = (avatar) => {
        console.log('Selected avatar:', avatar);
        setSelectedAvatar(avatar);
        setSaveEnabled(avatar !== userInfo.avatar);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/setAvatar`, {
            method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userInfo.user_id, avatar: selectedAvatar })
            });
            if (!response.ok) {
                throw new Error('Failed to update avatar');
            }
            setSaveEnabled(false);
            // Handle successful save (e.g., show notification or update user context)
        } catch (error) {
            console.error('Error saving avatar:', error);
        }
    };

    return (
        <Box sx={{ width: '50%', marginTop: 3 }}>
            <Grid container spacing={2} justifyContent="center">
                {avatars.length === 0 ? (
                    <CircularProgress />
                ) : (
                    avatars.map((avatar, index) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                            <Paper
                                elevation={avatar === selectedAvatar ? 6 : 2}
                                sx={{
                                    padding: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        transition: 'transform 0.2s ease-in-out'
                                    }
                                }}
                                onClick={() => handleAvatarClick(avatar)}
                            >
                                <img
                                    src={`/icons/${avatar}`}
                                    alt={`Avatar ${index}`}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                />
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>
            {isSaveEnabled && (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ marginTop: 3 }}
                >
                    Save Avatar
                </Button>
            )}
        </Box>
    );
};

export default AvatarSelection;
