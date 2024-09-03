import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, Box, Button, Grid, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { setAvatarAsync } from '../store/thunks/avatarThunks';

const AvatarSelection = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user.userInfo);
    const avatarUpdateStatus = useSelector(state => state.user.avatarUpdateStatus);
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(userInfo?.avatar);
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
        setSelectedAvatar(avatar);
        setSaveEnabled(avatar !== userInfo.avatar);
    };

    const handleSave = async () => {
        if (userInfo && selectedAvatar) {
            await dispatch(setAvatarAsync({ userId: userInfo.user_id, avatar: selectedAvatar }));
            setSaveEnabled(false);
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
                    disabled={avatarUpdateStatus === 'loading'}
                    sx={{ marginTop: 3 }}
                >
                    {avatarUpdateStatus === 'loading' ? 'Saving...' : 'Save Avatar'}
                </Button>
            )}
        </Box>
    );
};

export default AvatarSelection;
