import { useState, useEffect } from 'react';
import Web3 from 'web3';
import Chess from '../abis/Chess.json';
import { useSDK } from "@metamask/sdk-react";

const useContract = (gameId, walletAddress) => {
    const { sdk, provider } = useSDK();
    const [contractInstance, setContractInstance] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [contractBalance, setContractBalance] = useState(0);

    const web3 = new Web3(provider);

    useEffect(() => {
        if (provider && contractAddress) {
            const contract = new web3.eth.Contract(Chess.abi, contractAddress);
            setContractInstance(contract);
        }
    }, [provider, contractAddress]);

    const joinGame = async () => {
        try {
            if (!connected) {
                await sdk.requestPermissions({ eth_accounts: {} });
            }
            if (!contractInstance) {
                throw new Error('Contract instance not available');
            }

            const entryFeeInWei = await contractInstance.methods.getEntryFee().call();
            console.log('Entry fee in wei:', entryFeeInWei);
            console.log('contract methods:', contractInstance.methods);
            const tx = await contractInstance.methods.joinGame().send({
                from: walletAddress,
                value: entryFeeInWei,
                gas: 3000000
            });
            // setGameInfo(prev => ({ ...prev, transactionHash: tx.transactionHash }));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const cancelGame = async () => {
        try {
            await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/cancelGame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameId })
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return { contractInstance, contractAddress, contractBalance, joinGame, cancelGame };
}

export default useContract;
