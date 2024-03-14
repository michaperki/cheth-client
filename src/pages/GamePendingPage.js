// GamePendingPage.js
import React, { useState } from 'react';

const GamePendingPage = () => {
    // Define state to store opponent information and buy-in amount
    const [opponent, setOpponent] = useState(null);
    const [buyInAmount, setBuyInAmount] = useState('');

    // Function to handle buy-in submission
    const handleSubmitBuyIn = () => {
        // Submit buy-in logic goes here
    };

    return (
        <div>
            <h1>Game Pending</h1>
            {opponent ? (
                <div>
                    <p>Opponent: {opponent}</p>
                    <p>Buy-In Amount: {buyInAmount}</p>
                    {/* Form to submit buy-in */}
                    <form onSubmit={handleSubmitBuyIn}>
                        <label>
                            Buy-In Amount:
                            <input
                                type="text"
                                value={buyInAmount}
                                onChange={(e) => setBuyInAmount(e.target.value)}
                            />
                        </label>
                        <button type="submit">Submit Buy-In</button>
                    </form>
                </div>
            ) : (
                <p>Waiting for opponent...</p>
            )}
        </div>
    );
};

export default GamePendingPage;
