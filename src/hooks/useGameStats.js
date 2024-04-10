import { useState, useCallback } from 'react';

const useGameStats = (ethToUsdRate) => {
    const [gameCount, setGameCount] = useState(0);
    const [totalWageredInUsd, setTotalWageredInUsd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGameStats = useCallback(async () => {
        setIsLoading(true);
        try {
            await fetchGameCount();
            await fetchTotalWagered();
        } catch (error) {
            console.error('Error fetching game stats:', error);
        } finally {
            setIsLoading(false);
        }
    }, [ethToUsdRate]);

    const fetchGameCount = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getGameCount`);
            if (!response.ok) {
                throw new Error('Failed to fetch game count');
            }

            const data = await response.json();
            setGameCount(data.count);
        } catch (error) {
            console.error('Error fetching game count:', error);
            throw error;
        }
    };

    const fetchTotalWagered = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/game/getTotalWagered`);
            if (!response.ok) {
                throw new Error('Failed to fetch total wagered amount');
            }

            const data = await response.json();

            const convertedWagered = convertWageredToUsd(data.totalWagered, ethToUsdRate);
            setTotalWageredInUsd(convertedWagered);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const convertWageredToUsd = (wagered, rate) => {
        return rate ? (wagered / 10 ** 18) * rate : 0;
    };

    return { gameCount, totalWageredInUsd, isLoading, fetchGameStats };
};

export default useGameStats;
