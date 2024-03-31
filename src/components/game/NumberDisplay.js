import React, { useState, useEffect } from 'react';
import './NumberDisplay.css'; // Import CSS for styling
import { Typography } from '@mui/material';

const NumberDisplay = ({ amount }) => {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    const incrementAmount = () => {
      if (displayAmount < amount) {
        setDisplayAmount(prevAmount => prevAmount + 1);
      }
    };

    const interval = setInterval(incrementAmount, 10); // Adjust speed of ticking here

    return () => clearInterval(interval);
  }, [amount, displayAmount]);

  return (
    <div className="number-display">
      <Typography variant="h4" component="div" display="flex" alignItems="center" gutterBottom>
        <span style={{ marginRight: '0.5rem' }}>Reward Pool</span>
        <div className="text-5xl text-green-500 font-semibold">
          ${displayAmount.toLocaleString()}
        </div>
      </Typography>
    </div>
  );
}

export default NumberDisplay;
