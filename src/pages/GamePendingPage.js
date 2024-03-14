import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GamePendingPage = () => {
    const { gameId } = useParams();
    const [gameInfo, setGameInfo] = useState(null);
    const [creatingNewGame, setCreatingNewGame] = useState(false);

    useEffect(() => {
        // Fetch game information based on gameId
        const fetchGameInfo = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/getGameInfo/${gameId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch game information');
                }
                const data = await response.json();
                setGameInfo(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchGameInfo();
    }, [gameId]);

    const handleCreateNewGame = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/createNewGame`);
            if (!response.ok) {
                throw new Error('Failed to create new game');
            }
            // Fetch updated game information
            const updatedGameInfo = await response.json();
            setGameInfo(updatedGameInfo);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            {gameInfo ? (
                <div>
                    <h2>Game ID: {gameInfo.gameId}</h2>
                    <p>Player One: {gameInfo.playerOne}</p>
                    <p>Player Two: {gameInfo.playerTwo}</p>
                    <p>Reward Pool: {gameInfo.rewardPool}</p>
                    {!gameInfo.isStarted && (
                        <>
                            <button onClick={handleCreateNewGame} disabled={creatingNewGame}>
                                {creatingNewGame ? 'Creating New Game...' : 'Create New Game'}
                            </button>
                            <p>or</p>
                        </>
                    )}
                    <p>Join the game by sending the required entry fee to the contract address.</p>
                </div>
            ) : (
                <p>Loading game information...</p>
            )}
        </div>
    );
};

export default GamePendingPage;
