import { useState } from 'react';

const useSubmitUserInfo = (lichessUsername, walletAddress) => {
    const [submitted, setSubmitted] = useState(false);

    const submit = async () => {
        if (!lichessUsername || !walletAddress) {
            console.warn("Required information is missing");
            return;
        }

        setSubmitted(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/user/addUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lichessHandle: lichessUsername,
                    walletAddress,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit user information');
            }

            // Optionally handle the response data here
            const data = await response.json();
            console.log("User info submitted successfully:", data);
        } catch (err) {
            console.error('Failed to submit user info:', err);
            // Optionally reset the submitted state here if you want to allow retrying
            // setSubmitted(false);
        }
    };

    return { submit, submitted };
};

export default useSubmitUserInfo;
