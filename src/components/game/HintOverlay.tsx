import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HintOverlayProps {
  isVisible: boolean;
  hintText: string;
  onDismiss: () => void;
}

const HintOverlay = ({ isVisible, hintText, onDismiss }: HintOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl text-center"
          >
            <p className="text-3xl mb-3">💡</p>
            <p className="text-speech text-card-foreground mb-6">{hintText}</p>
            <Button
              onClick={onDismiss}
              className="rounded-full bg-primary text-primary-foreground px-8 h-12 text-button"
            >
              Got it!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HintOverlay;
