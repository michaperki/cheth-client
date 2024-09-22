import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { depositToSession } from '../../services/sessionService';
import { toast } from 'react-toastify';
import { setSessionBalance } from '../../store/slices/userSlice';

const DepositModal = ({ open, handleClose }) => {
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const walletAddress = useSelector(state => state.user.walletAddress);

  const handleDeposit = async () => {
    try {
      const result = await depositToSession(amount, walletAddress);
      if (result && result.newBalance) {
        dispatch(setSessionBalance(result.newBalance.toString()));
        toast.success('Deposit successful');
        handleClose();
      } else {
        toast.error('Deposit failed: Invalid response');
      }
    } catch (error) {
      console.error('Error depositing:', error);
      toast.error('Deposit failed: ' + (error.message || 'Unknown error'));
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
