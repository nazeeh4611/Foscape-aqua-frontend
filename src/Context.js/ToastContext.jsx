import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const baseToast = (t, Icon, title, message) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } w-full max-w-xs md:max-w-sm backdrop-blur-xl bg-black/40 border border-black/30 shadow-lg rounded-2xl p-3 flex items-center gap-3`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1">
        <p className="text-sm text-white font-medium">{title}</p>
        <p className="text-xs text-white/80">{message}</p>
      </div>

      <button
        onClick={() => toast.dismiss(t.id)}
        className="text-white/70 hover:text-white transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  const showToast = {
    success: (message, options = {}) =>
      toast.custom(
        (t) => baseToast(t, CheckCircle, 'Success', message),
        { duration: 1500, ...options }
      ),

    error: (message, options = {}) =>
      toast.custom(
        (t) => baseToast(t, XCircle, 'Error', message),
        { duration: 1500, ...options }
      ),

    info: (message, options = {}) =>
      toast.custom(
        (t) => baseToast(t, Info, 'Info', message),
        { duration: 1500, ...options }
      ),

    warning: (message, options = {}) =>
      toast.custom(
        (t) => baseToast(t, AlertCircle, 'Warning', message),
        { duration: 1500, ...options }
      ),

    loading: (message) =>
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } w-full max-w-xs md:max-w-sm backdrop-blur-xl bg-black/40 border border-black/30 shadow-lg rounded-2xl p-3 flex items-center gap-3`}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>

            <p className="text-sm text-white font-medium">{message}</p>
          </div>
        ),
        { duration: Infinity }
      ),

    promise: (promise, messages) =>
      toast.promise(
        promise,
        {
          loading: messages.loading,
          success: messages.success,
          error: messages.error,
        },
        { style: { minWidth: '250px' } }
      ),

    dismiss: (id) => toast.dismiss(id),
    dismissAll: () => toast.dismiss(),
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      />

      <style jsx global>{`
        @keyframes enter {
          0% {
            transform: translateX(20px);
            opacity: 0;
            filter: blur(4px);
          }
          100% {
            transform: translateX(0);
            opacity: 1;
            filter: blur(0);
          }
        }

        @keyframes leave {
          0% {
            transform: translateX(0);
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: translateX(20px);
            opacity: 0;
            filter: blur(4px);
          }
        }

        .animate-enter {
          animation: enter 0.25s ease-out;
        }

        .animate-leave {
          animation: leave 0.25s ease-in forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};
