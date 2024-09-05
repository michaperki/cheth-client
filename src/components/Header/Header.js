import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Typography, Link, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useWallet from 'hooks/useWallet';

import './Header.css';

const Header = ({ userInfo, toggleDarkMode, darkMode, isAdmin }) => {
    const { walletAddress, connectAccount } = useWallet();
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
                        {/* User Info */}
                    </Box>
                )}

                {walletAddress && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ marginRight: 1 }}>
                            {abbreviatedWalletAddress}
                        </Typography>
                        {/* make the image a link */}
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
			data-testid="dark-mode-toggle" // Adding a testId for easier selection
		    >
			{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
		    </IconButton>
	    </Toolbar>
        </AppBar>
    );
};

export default Header;
