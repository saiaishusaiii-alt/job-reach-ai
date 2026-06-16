import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useApp();

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none space-y-2">
        {toasts.map((toast) => {
          const Icon =
            toast.type === 'success'
              ? CheckCircle
              : toast.type === 'error'
                ? XCircle
                : Info;

          const bgColor =
            toast.type === 'success'
              ? 'bg-green-500/20 border-green-500/30'
              : toast.type === 'error'
                ? 'bg-red-500/20 border-red-500/30'
                : 'bg-violet-500/20 border-violet-500/30';

          const textColor =
            toast.type === 'success'
              ? 'text-green-400'
              : toast.type === 'error'
                ? 'text-red-400'
                : 'text-violet-400';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              className={`glass-card ${bgColor} border pointer-events-auto flex items-center gap-3 p-4 max-w-sm`}
            >
              <Icon size={20} className={textColor} />
              <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X size={16} className="text-slate-400" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
};

export default Toast;
