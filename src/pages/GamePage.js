import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GamePage = ({ gameId }) => {
    // State to track if the game is ready
    const [gameReady, setGameReady] = useState(false);

    // Simulate fetching game data based on gameId
    useEffect(() => {
        // Here you can fetch game data using the gameId
        // For example:
        // const fetchGameData = async () => {
        //     try {
        //         // Fetch game data based on gameId
        //         const response = await fetch(`/api/game/${gameId}`);
        //         const gameData = await response.json();
        //         // Check if game data indicates that the game is ready
        //         if (gameData.state === 'ready') {
        //             setGameReady(true);
        //         }
        //     } catch (error) {
        //         console.error('Error fetching game data:', error);
        //     }
        // };

        // fetchGameData();
        // For demonstration purpose, setting gameReady to true after a delay
        const timer = setTimeout(() => {
            setGameReady(true);
        }, 2000);

        // Clean up timeout
        return () => clearTimeout(timer);
    }, [gameId]);

    return (
        <div>
            <h1>Game Page</h1>
            {gameReady ? (
                <div>
                    <p>Game {gameId} is ready!</p>
                    {/* Add game components here */}
                </div>
            ) : (
                <p>Game {gameId} is still loading...</p>
            )}
        </div>
    );
};

export default GamePage;
