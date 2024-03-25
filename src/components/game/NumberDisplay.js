import React, { useState, useEffect } from 'react';
import './NumberDisplay.css'; // Import CSS for styling

const NumberDisplay = ({ amount }) => {
    console.log('amount:', amount);
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
    <div className="flex items-center justify-center text-5xl text-green-500 font-semibold">
      ${displayAmount.toLocaleString()}
    </div>
  );
};

export default NumberDisplay;
