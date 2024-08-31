import { toast } from 'react-toastify';

export const createErrorHandler = () => {
  return (error, customMessage = 'An error occurred') => {
    console.error(error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      toast.error(error.response.data.message || customMessage);
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response received from server. Please try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error(customMessage);
    }
  };
};

export const createDisplayMessage = () => {
  return (message, type = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warn(message);
        break;
      default:
        toast.info(message);
    }
  };
};
