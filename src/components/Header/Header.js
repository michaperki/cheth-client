import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Typography, Link, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import useWallet from 'hooks/useWallet';
import { useSelector, useDispatch } from 'react-redux';
import DepositModal from '../shared/DepositModal';
import { setSessionBalance } from '../../store/slices/userSlice';
import { getSessionBalance } from '../../services/sessionService';

import './Header.css';

const Header = ({ userInfo, toggleDarkMode, darkMode, isAdmin }) => {
    const dispatch = useDispatch();
    const { walletAddress, connectAccount } = useWallet();
    const sessionBalance = useSelector((state) => state.user.sessionBalance);
    const [openDepositModal, setOpenDepositModal] = useState(false);

    useEffect(() => {
        const getBalance = async () => {
            if (walletAddress) {
                try {
                    const balance = await getSessionBalance(walletAddress);
                    dispatch(setSessionBalance(balance.toString()));
                } catch (error) {
                    console.error('Error getting session balance:', error);
                }
            }
        };
        getBalance();
    }, [walletAddress, dispatch]);
    
    const abbreviatedWalletAddress = walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : '';
    const getAvatarSrc = (avatar) => avatar && avatar !== 'none' ? `/icons/${avatar}` : '/icons/hoodie_blue.svg';

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                    <Typography variant="h6" component={RouterLink} to="/" color="inherit" sx={{ marginRight: 2, textDecoration: 'none' }} className="menu-link">
                        Home
                    </Typography>
                    {isAdmin && (
                        <Typography variant="h6" component={RouterLink} to="/admin" color="inherit" sx={{ marginRight: 2, textDecoration: 'none' }} className="menu-link">
                            Admin
                        </Typography>
                    )}
                </Box>

                {!walletAddress ? (
                    <Button color="inherit" onClick={connectAccount}>Connect Wallet</Button>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                            <AccountBalanceWalletIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body2">{sessionBalance || '0'} TUSA</Typography>
                        </Box>
                        <Button 
                            color="inherit" 
                            onClick={() => setOpenDepositModal(true)}
                            sx={{ marginRight: 2 }}
                        >
                            Deposit
                        </Button>
                        <Typography variant="body2" sx={{ marginRight: 1 }}>
                            {abbreviatedWalletAddress}
                        </Typography>
                        <Link component={RouterLink} to="/account" sx={{ display: 'flex', alignItems: 'center' }} className="menu-link">
                            <img
                                src={getAvatarSrc(userInfo?.avatar)}
                                alt="User Avatar"
                                className="avatar"
                            />
                        </Link>
                    </Box>
                )}

                <IconButton
                    color="inherit"
                    onClick={toggleDarkMode}
                    data-testid="dark-mode-toggle"
                >
                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Toolbar>
            <DepositModal open={openDepositModal} handleClose={() => setOpenDepositModal(false)} />
        </AppBar>
    );
};

export default Header;
