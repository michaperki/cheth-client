import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography, Tabs, Tab, Box } from '@mui/material';
import AvatarSelection from 'components/AvatarSelection';
import WagerHistory from './WagerHistory';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AccountPage = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Account Page
      </Typography>
      <Typography variant="h6" gutterBottom>
        Welcome, {userInfo?.username}
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="account tabs">
        <Tab label="Avatar" />
        <Tab label="Wager History" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        {userInfo && <AvatarSelection userInfo={userInfo} />}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <WagerHistory />
      </TabPanel>
    </Container>
  );
};

export default AccountPage;
