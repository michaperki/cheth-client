const getUser = async (walletAddress) => {
  try {
    const cachedUser = localStorage.getItem(`userInfo_${walletAddress}`);
    if (cachedUser) {
      const { data, timestamp } = JSON.parse(cachedUser);
      if (Date.now() - timestamp < 30 * 60 * 1000) { // 30 minutes
        console.log('User data from cache:', data);
        return data;
      }
    }

    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/getUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ walletAddress })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    console.log('User data:', data);
    localStorage.setItem(`userInfo_${walletAddress}`, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
