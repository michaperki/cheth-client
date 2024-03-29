import React from 'react';
import { Box, Typography } from '@mui/material';
import UserIcon from '@mui/icons-material/PeopleAlt'; // Import UserIcon
import GamesIcon from '@mui/icons-material/SportsEsports'; // Import GamesIcon
import MoneyIcon from '@mui/icons-material/Money'; // Import MoneyIcon

const StatisticBubble = ({ value, label, icon }) => {
  return (
    <Box sx={{ borderRadius: 8, border: 1, p: 2, mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {icon && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}
        {label}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
  );
}

const Sidebar = ({ usersOnline, gamesCreated, transactedAmount }) => {
  // Format transactedAmount as a dollar value with comma
  const formattedTransactedAmount = transactedAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <Box sx={{ flex: 1, ml: 2 }}>
      <StatisticBubble
        value={usersOnline}
        label="Users Online"
        icon={<UserIcon />}
      />
      <StatisticBubble
        value={gamesCreated}
        label="Games Created"
        icon={<GamesIcon />}
      />
      <StatisticBubble
        value={formattedTransactedAmount}
        label="Transacted"
        icon={<MoneyIcon />}
      />
    </Box>
  );
}

export default Sidebar;
