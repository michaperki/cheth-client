import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context
const EthereumPriceContext = createContext();

// Create a provider component
export const EthereumPriceProvider = ({ children }) => {
  const [ethToUsdRate, setEthToUsdRate] = useState(0);

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/ethToUsd`);
        if (!response.ok) {
          throw new Error('Failed to fetch ETH to USD conversion rate');
        }
        const data = await response.json();
        console.log('ETH to USD conversion rate:', data);
        setEthToUsdRate(data);
      } catch (error) {
        console.error('Error fetching ETH to USD conversion rate:', error);
      }
    };

    fetchEthToUsdRate();
  }, []); // Fetch the rate only once when the component mounts

  return (
    <EthereumPriceContext.Provider value={ethToUsdRate}>
      {children}
    </EthereumPriceContext.Provider>
  );
};

// Custom hook to consume the Ethereum price context
export const useEthereumPrice = () => {
  return useContext(EthereumPriceContext);
};
