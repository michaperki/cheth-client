import { useState, useEffect } from 'react';
const { ethers } = require('ethers');

const useContract = (abi, contractAddress) => {
    const [contractInstance, setContractInstance] = useState(null);

    useEffect(() => {
        if (!abi || !contractAddress) {
            console.error('ABI or contract address is missing.');
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);
            setContractInstance(contract);
        } catch (error) {
            console.error('Error initializing contract instance:', error);
        }
    }, [abi, contractAddress]);

    return contractInstance;
};

export default useContract;
