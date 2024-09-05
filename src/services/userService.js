// Used to fetch user data from the server

const getUser = async (walletAddress) => {
    try {
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
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };
  
  export default getUser;
  
