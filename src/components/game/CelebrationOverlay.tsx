import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface CelebrationOverlayProps {
  isVisible: boolean;
  message: string;
  onComplete: () => void;
}

const CelebrationOverlay = ({ isVisible, message, onComplete }: CelebrationOverlayProps) => {
  useEffect(() => {
    if (isVisible) {
      // Fire confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7fb896", "#e07850", "#f5c842", "#4a90d9"],
      });

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
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
