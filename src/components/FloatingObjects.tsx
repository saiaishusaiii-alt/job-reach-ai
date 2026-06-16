import { motion } from 'framer-motion';
import {
  FileText,
  Mail,
  Star,
  Settings,
  Briefcase,
} from 'lucide-react';

const FloatingObjects = () => {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      {/* Floating Resume Card */}
      <motion.div
        className="absolute top-1/5 left-8 w-20 h-28 glass-card flex flex-col items-center justify-center"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
        style={{ opacity: 0.25 }}
      >
        <div className="w-14 h-16 flex flex-col gap-2 p-2">
          <div className="h-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"></div>
          <div className="h-0.5 bg-slate-500/40 rounded"></div>
          <div className="h-0.5 bg-slate-500/30 rounded"></div>
          <div className="h-0.5 bg-slate-500/30 rounded"></div>
        </div>
      </motion.div>

      {/* Floating Envelope */}
      <motion.div
        className="absolute top-1/3 right-10 w-16 h-12 glass-card flex items-center justify-center"
        animate={{
          y: [0, -8, 0],
          rotate: [2, -2, 2],
        }}
        transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
        style={{ opacity: 0.2 }}
      >
        <Mail size={24} className="text-slate-400" />
      </motion.div>

      {/* Floating Star */}
      <motion.div
        className="absolute bottom-1/3 left-12"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 15, 0],
        }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
        style={{ opacity: 0.3 }}
      >
        <Star size={32} className="text-violet-500" />
      </motion.div>

      {/* Floating Gear */}
      <motion.div
        className="absolute bottom-1/4 right-8"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        style={{ opacity: 0.15 }}
      >
        <Settings size={40} className="text-cyan-500" />
      </motion.div>

      {/* Floating Briefcase */}
      <motion.div
        className="absolute top-3/5 left-5"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity }}
        style={{ opacity: 0.2 }}
      >
        <Briefcase size={36} className="text-pink-500" />
      </motion.div>

      {/* Floating File Icon - Additional decoration */}
      <motion.div
        className="absolute top-1/2 right-1/4"
        animate={{
          y: [0, -15, 0],
          x: [-5, 5, -5],
        }}
        transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
        style={{ opacity: 0.18 }}
      >
        <FileText size={28} className="text-cyan-500/60" />
      </motion.div>
    </div>
  );
};

export default FloatingObjects;
