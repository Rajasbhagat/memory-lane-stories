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
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-xl text-center border-2 border-border"
          >
            <p className="text-5xl mb-4">💡</p>
            <p className="text-speech text-card-foreground mb-8">{hintText}</p>
            <Button
              onClick={onDismiss}
              variant="accent"
              size="lg"
              className="w-full"
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
