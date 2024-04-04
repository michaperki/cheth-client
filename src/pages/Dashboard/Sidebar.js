import React from 'react';
import { Box, Typography } from '@mui/material';
import UserIcon from '@mui/icons-material/PeopleAlt';
import GamesIcon from '@mui/icons-material/SportsEsports';
import MoneyIcon from '@mui/icons-material/Money';
import { useTheme } from '@mui/material/styles';

const StatisticBubble = ({ value, label, icon }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{
      borderRadius: 2,
      border: 1,
      borderColor: 'divider',
      padding: 2,
      marginBottom: 2,
      boxShadow: theme.shadows[2],
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        cursor: 'pointer',
      },
      '.statistic-label': {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 1,
      },
      '.statistic-label-icon': {
        marginRight: 1,
      },
      '.statistic-value': {
        fontSize: '1.5rem',
        fontWeight: 'bold',
      }
    }}>
      <Typography className="statistic-label">
        <span className="statistic-label-icon">{icon}</span>
        {label}
      </Typography>
      <Typography className="statistic-value">{value}</Typography>
    </Box>
  );
};

const Sidebar = ({ usersOnline, gamesCreated, transactedAmount }) => {
  const formattedTransactedAmount = transactedAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <Box sx={{ flex: 1, ml: 2 }}>
      <StatisticBubble value={usersOnline} label="Users Online" icon={<UserIcon />} />
      <StatisticBubble value={gamesCreated} label="Games Created" icon={<GamesIcon />} />
      <StatisticBubble value={formattedTransactedAmount} label="Transacted" icon={<MoneyIcon />} />
    </Box>
  );
};

export default Sidebar;
