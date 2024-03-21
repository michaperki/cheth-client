import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebSocket from '../hooks/useWebsocket';

const DashboardPage = ({ userInfo }) => {
    const navigate = useNavigate();

    // Function to handle WebSocket messages
    const handleWebSocketMessage = (message) => {
        console.log('Received message in DashboardPage:', message);
        const messageData = JSON.parse(message);
        console.log('messageData', messageData);

        if (messageData.type === "START_GAME") {
            console.log("Game started. Navigating to game pending page...");
            const gameId = messageData.gameId;
            navigate(`/game-pending/${gameId}`);
        }
    };

    // Use the useWebSocket hook to establish WebSocket connection
    const socket = useWebSocket(handleWebSocketMessage);

    const playGame = async () => {
        try {
            if (!userInfo) {
                console.error('User information not available.');
                return;
            }

            console.log('Playing game for user:', userInfo.user_id);
   
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/playGame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userInfo.user_id })
            });

            if (!response.ok) {
                throw new Error('Failed to play the game.');
            }
    
            // Handle success response
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className={`min-h-screen flex flex-col justify-center items-center ${userInfo?.dark_mode ? 'dark-mode' : 'light-mode'}`}>
            <div className="max-w-md w-full p-8 bg-white rounded shadow-lg dark:bg-gray-800 dark:text-white">
                <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
                <p className="mb-4">Welcome, {userInfo?.username}</p>
                <button
                    onClick={playGame}
                    className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                >
                    Play Game
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;
