export const createErrorHandler = (setSnackbarOpen, setSnackbarMessage) => {
  return (error, customMessage = 'An error occurred') => {
    console.error(error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      setSnackbarMessage(error.response.data.message || customMessage);
    } else if (error.request) {
      // The request was made but no response was received
      setSnackbarMessage('No response received from server. Please try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      setSnackbarMessage(customMessage);
    }
    
    setSnackbarOpen(true);
  };
};

export const createDisplayMessage = (setSnackbarOpen, setSnackbarMessage) => {
  return (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
};
