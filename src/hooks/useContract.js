import { useEffect, useState } from 'react';
import Web3 from 'web3';
import ChessGame from '../abis/ChessGame.json';

const useContract = (contractAddress, abi) => {
    console.log('contractAddress in useContract Hook:', contractAddress);
  const [contractInstance, setContractInstance] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (contractAddress && abi) {
        console.log('Initializing contract instance...')
      // Initialize contract instance
      const web3 = new Web3(window.ethereum); // Assuming you're using MetaMask
      const instance = new web3.eth.Contract(abi, contractAddress);
      setContractInstance(instance);

      console.log('Subscribing to events...');

      // Subscribe to events
      const eventListener = instance.events.allEvents((error, event) => {
        if (error) {
          console.error('Error fetching events:', error);
          return;
        }
        console.log('Received event:', event);
        setEvents((prevEvents) => [...prevEvents, event]);
      });

      // Cleanup function
      return () => {
        eventListener.unsubscribe();        
      };
    }
  }, [contractAddress, abi]);

  return { contractInstance, events };
}

export default useContract;
