import { useState, useEffect } from 'react';

const useDarkMode = () => {
    // Determines if the user has a set preference for dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // State to store the user's preference
    const [darkMode, setDarkMode] = useState(prefersDarkMode);

    // Effect to listen for changes in the user's preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            setDarkMode(mediaQuery.matches);
        };

        mediaQuery.addListener(handleChange);

        return () => mediaQuery.removeListener(handleChange);
    }, []);

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return { darkMode, toggleDarkMode };
};

export default useDarkMode;
