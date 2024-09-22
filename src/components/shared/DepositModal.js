// src/components/shared/DepositModal.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { depositToSession } from '../../services/sessionService';
import { toast } from 'react-toastify';

const DepositModal = ({ open, handleClose }) => {
  const [amount, setAmount] = useState('');
  const walletAddress = useSelector(state => state.user.walletAddress); // Get wallet address from Redux store

  const handleDeposit = async () => {
    try {
      await depositToSession(amount, walletAddress);
      toast.success('Deposit successful');
      handleClose();
    } catch (error) {
      console.error('Error depositing:', error);
      toast.error('Deposit failed');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ /* styles */ }}>
        <Typography variant="h6">Deposit to Session</Typography>
        <TextField
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          label="Amount"
          type="number"
        />
        <Button onClick={handleDeposit}>Deposit</Button>
      </Box>
    </Modal>
  );
};

export default DepositModal;
