import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface CelebrationOverlayProps {
  isVisible: boolean;
  message: string;
  onComplete: () => void;
}

const CelebrationOverlay = ({ isVisible, message, onComplete }: CelebrationOverlayProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/10 px-6"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 shadow-xl text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-6xl"
            >
              🎉
            </motion.div>
            <p className="text-heading font-bold text-primary">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationOverlay;
