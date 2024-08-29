import { toast } from 'react-toastify';

const useToast = () => {
  const showToast = (message, type = 'info') => {
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

  return { showToast };
};

export default useToast;
