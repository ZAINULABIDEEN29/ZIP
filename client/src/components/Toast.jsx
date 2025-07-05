import { Toaster, toast } from 'react-hot-toast';

export const showToast = (message, type = 'success') => {
  if (type === 'error') toast.error(message);
  else toast.success(message);
};

export { Toaster }; 