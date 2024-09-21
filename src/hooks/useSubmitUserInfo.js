import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setPlayerInfo } from '../store/slices/userSlice';
import { getToken } from '../services/authService';
import { createPlayer } from '../services/apiService';

const useSubmitUserInfo = (lichessUsername, walletAddress) => {
    const [submitted, setSubmitted] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submit = async () => {
        if (!lichessUsername || !walletAddress) {
            console.warn("Required information is missing");
            toast.error("Required information is missing");
            return;
        }

        setSubmitted(true);

        try {
            const token = getToken();
            if (!token) {
                throw new Error('User not authenticated with Virtual Labs');
            }

            const data = {
                lichessHandle: lichessUsername,
                address: walletAddress,
                rollupId: process.env.REACT_APP_VIRTUAL_LABS_ROLLUP_ID,
            };

            console.log("Submitting player info:", data);
            const result = await createPlayer(data);
            console.log("Player info submitted successfully:", result);

            // Update Redux store with player info
            dispatch(setPlayerInfo(result));

            toast.success('Player info submitted successfully');
            navigate('/dashboard');

        } catch (err) {
            console.error('Failed to submit player info:', err);
            if (err.response) {
                console.error('Error response:', await err.response.text());
            }
            toast.error('Failed to submit player info. Please try again.');
            setSubmitted(false);
        }
    };

    return { submit, submitted };
};

export default useSubmitUserInfo;
