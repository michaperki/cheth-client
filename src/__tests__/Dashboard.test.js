import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '../pages/Dashboard/DashboardPage';

describe('DashboardPage', () => {
  test('renders dashboard page with welcome message', () => {
    const userInfo = { username: 'TestUser' };
    const { getByText } = render(<DashboardPage userInfo={userInfo} onlineUsersCount={10} />);
    const welcomeMessage = getByText(/Welcome, TestUser/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('clicking play game button triggers playGame function', async () => {
    const userInfo = { username: 'TestUser', user_id: 123 };
    const { getByRole } = render(<DashboardPage userInfo={userInfo} onlineUsersCount={10} />);
    const playGameButton = getByRole('button', { name: /Play a Game/i });
    fireEvent.click(playGameButton);
    await waitFor(() => expect(console.log).toHaveBeenCalledWith('Playing game for user:', userInfo.user_id));
  });
});
