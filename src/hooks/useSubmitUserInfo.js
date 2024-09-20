
import { useState } from 'react';
import { createPlayer } from '../services/apiService';
import { getToken } from '../services/authService';

const useSubmitUserInfo = (lichessUsername, walletAddress) => {
    const [submitted, setSubmitted] = useState(false);

    const submit = async () => {
        if (!lichessUsername || !walletAddress) {
            console.warn("Required information is missing");
            return;
        }

        setSubmitted(true);

          try {
            const token = getToken();
            if (!token) {
              throw new Error('User not authenticated with Virtual Labs');
            }

            const data = {
              address: walletAddress,
              rollupId: process.env.REACT_APP_VIRTUAL_LABS_ROLLUP_ID // Add this line
            };

            console.log("Submitting player info:", data); // Add this log
            const result = await createPlayer(data);
            console.log("Player info submitted successfully:", result);

          } catch (err) {
            console.error('Failed to submit player info:', err);
            if (err.response) {
              console.error('Error response:', await err.response.text());
            }
            setSubmitted(false);
          }
            };

    return { submit, submitted };
};

export default useSubmitUserInfo;

