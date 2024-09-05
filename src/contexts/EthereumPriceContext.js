import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const EthereumPriceContext = createContext();

export const EthereumPriceProvider = ({ children }) => {
  const [ethToUsdRate, setEthToUsdRate] = useState(0);

  const fetchEthToUsdRate = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/crypto/ethToUsd`);
      if (!response.ok) {
        throw new Error('Failed to fetch ETH to USD conversion rate');
      }
      const data = await response.json();
      setEthToUsdRate(data);
      console.log('ETH to USD conversion rate:', data);
    } catch (error) {
      console.error('Error fetching ETH to USD conversion rate:', error);
    }
  }, []);

  useEffect(() => {
    fetchEthToUsdRate();
    
    const intervalId = setInterval(() => {
      fetchEthToUsdRate();
    }, 5 * 60 * 1000); // Fetch every 5 minutes

    return () => clearInterval(intervalId);
  }, [fetchEthToUsdRate]);

  return (
    <EthereumPriceContext.Provider value={ethToUsdRate}>
      {children}
    </EthereumPriceContext.Provider>
  );
};

export const useEthereumPrice = () => {
  return useContext(EthereumPriceContext);
};
