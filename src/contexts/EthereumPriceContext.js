import React, { createContext, useContext, useEffect, useState } from 'react';
//
// Create a context
const EthereumPriceContext = createContext();

// Create a provider component
export const EthereumPriceProvider = ({ children }) => {
  const [ethToUsdRate, setEthToUsdRate] = useState(0);

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      try {
        const cachedRate = localStorage.getItem('ethToUsdRate');
        if (cachedRate) {
          const { rate, timestamp } = JSON.parse(cachedRate);
          if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes
            setEthToUsdRate(rate);
            return;
          }
        }

        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/crypto/ethToUsd`);
        if (!response.ok) {
          throw new Error('Failed to fetch ETH to USD conversion rate');
        }
        const data = await response.json();
        setEthToUsdRate(data);
        localStorage.setItem('ethToUsdRate', JSON.stringify({ rate: data, timestamp: Date.now() }));
      } catch (error) {
        console.error('Error fetching ETH to USD conversion rate:', error);
      }
    };

    fetchEthToUsdRate();
    const intervalId = setInterval(fetchEthToUsdRate, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  // ... rest of the component
};

// Custom hook to consume the Ethereum price context
export const useEthereumPrice = () => {
  return useContext(EthereumPriceContext);
};
