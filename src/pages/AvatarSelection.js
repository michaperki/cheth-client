import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box, Grid, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    marginTop: theme.spacing(3),
  },
  avatar: {
    width: 100,
    height: 100,
    margin: theme.spacing(1),
    cursor: 'pointer',
  },
}));

const AvatarSelection = ({ userInfo }) => {
  const classes = useStyles();
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch('/icons');
        if (!response.ok) {
          throw new Error('Failed to fetch avatars');
        }
        const avatarFiles = await response.json();
        setAvatars(avatarFiles);
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }

    };

    fetchAvatars();
  }, []);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
    // You can perform additional actions here, such as updating the user's avatar in the database
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Choose Your Avatar
      </Typography>
      <Grid container spacing={2} className={classes.avatarContainer}>
        {avatars.length === 0 ? (
          <CircularProgress />
        ) : (
          avatars.map((avatar) => (
            <Grid item key={avatar} xs={3}>
              <IconButton onClick={() => handleAvatarClick(avatar)}>
                <img src={`/icons/${avatar}`} alt="Avatar" className={classes.avatar} />
              </IconButton>
            </Grid>
          ))
        )}
      </Grid>
      {selectedAvatar && (
        <Box mt={2}>
          <Typography variant="body1">Selected Avatar: {selectedAvatar}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default AvatarSelection;
