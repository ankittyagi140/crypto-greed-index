import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { toast as hotToast } from 'react-hot-toast';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
}

export const toast = ({ message, type = 'success', duration = 3000 }: ToastProps) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  hotToast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full ${colors[type]} shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {icons[type]}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => hotToast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    ),
    {
      duration,
      position: 'top-right',
    }
  );
};

export const successToast = (message: string, duration?: number) => {
  toast({ message, type: 'success', duration });
};

export const errorToast = (message: string, duration?: number) => {
  toast({ message, type: 'error', duration });
};

export const warningToast = (message: string, duration?: number) => {
  toast({ message, type: 'warning', duration });
}; 