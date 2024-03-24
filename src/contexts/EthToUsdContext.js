import React, { createContext, useContext, useState } from 'react';

const EthToUsdContext = createContext();

export const EthToUsdProvider = ({ children }) => {
    const [ethToUsdRate, setEthToUsdRate] = useState(0);

    return (
        <EthToUsdContext.Provider value={{ ethToUsdRate, setEthToUsdRate }}>
            {children}
        </EthToUsdContext.Provider>
    );
};

export const useEthToUsd = () => useContext(EthToUsdContext);
