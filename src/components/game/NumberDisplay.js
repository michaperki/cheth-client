// src/components/game/NumberDisplay.js

import React, { useState, useEffect } from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import './NumberDisplay.css';

const NumberDisplay = ({ amount }) => {
  const [displayAmount, setDisplayAmount] = useState(0);
  const theme = useTheme();
  console.log("amount:", amount);

  useEffect(() => {
    const incrementAmount = () => {
      if (displayAmount < amount) {
        setDisplayAmount(prevAmount => prevAmount + 1);
      }
    };

    const interval = setInterval(incrementAmount, 10);
    return () => clearInterval(interval);
  }, [amount, displayAmount]);

  return (
    <Box className="number-display" sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h6" color="textSecondary">
        Reward Pool:
      </Typography>
      <Typography variant="h4" component="div" sx={{ ml: 2, fontWeight: 'bold', color: theme.palette.success.main }}>
        ${displayAmount.toLocaleString()}
      </Typography>
    </Box>
  );
}

export default NumberDisplay;
