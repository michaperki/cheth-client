// Importing hooks from the websocket sub-directory
import { 
    useGamePendingWebsocket, 
    useGameWebsocket, 
    useDashboardWebsocket,
    useWebSocket 
} from './websocket';

// Importing other hooks from their respective files
export { default as useWallet } from './useWallet';
export { default as useContract } from './useContract';

// Re-exporting websocket hooks
export { 
    useGamePendingWebsocket, 
    useGameWebsocket, 
    useDashboardWebsocket,
    useWebSocket 
};
