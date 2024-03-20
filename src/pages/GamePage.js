import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GamePage = () => {
    const { gameId } = useParams();
    const [gameUrl, setGameUrl] = useState('');

    useEffect(() => {
        const getGameInfo = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/getGame/${gameId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ gameId })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setGameUrl(data.url);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        getGameInfo();
    }, [gameId]);

    const handleSubmitGameURL = async () => {
        try {
            // Assuming you have a backend endpoint to update the game URL
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/submitGameURL`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameId, gameUrl })
            });

            if (!response.ok) {
                throw new Error('Failed to submit game URL');
            }

            // Handle success, for example, show a success message or navigate to another page
            console.log('Game URL submitted successfully!');
        } catch (error) {
            console.error('Error submitting game URL:', error);
        }
    };

    return (
        <div>
            <h1>Game Page</h1>
            <p>Game ID: {gameId}</p>
            <p>Game URL: {gameUrl}</p>
            <input type="text" value={gameUrl} onChange={(e) => setGameUrl(e.target.value)} />
            <button onClick={handleSubmitGameURL}>Submit Game URL</button>
        </div>
    );
};

export default GamePage;
