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
export { default as useDarkMode } from './useDarkMode';
export { default as useFetchUser } from './useFetchUser';
export { default as useCheckEligibility } from './useCheckEligibility';
export { default as useSubmitUserInfo } from './useSubmitUserInfo';
export { default as useGameStats } from './useGameStats';
export { default as useGameActions } from './useGameActions';
export { default as useToast } from './useToast';

// Re-exporting websocket hooks
export { 
    useGamePendingWebsocket, 
    useGameWebsocket, 
    useDashboardWebsocket,
    useWebSocket 
};
