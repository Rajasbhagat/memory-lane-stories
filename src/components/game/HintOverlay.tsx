import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HintOverlayProps {
  isVisible: boolean;
  hintText: string;
  hintTier: 0 | 1 | 2 | 3;
  onDismiss: () => void;
}

const tierConfig = {
  0: { icon: "💡", iconSize: "text-4xl", glow: false, autoAdvance: false, buttonText: "Got it!", bgAccent: "border-border" },
  1: { icon: "💡", iconSize: "text-4xl", glow: false, autoAdvance: false, buttonText: "Got it!", bgAccent: "border-border" },
  2: { icon: "🔍", iconSize: "text-5xl", glow: true, autoAdvance: false, buttonText: "I'll look again!", bgAccent: "border-accent/30" },
  3: { icon: "👉", iconSize: "text-6xl", glow: true, autoAdvance: true, buttonText: "Show me!", bgAccent: "border-primary/30" },
};

const HintOverlay = ({ isVisible, hintText, hintTier, onDismiss }: HintOverlayProps) => {
  const config = tierConfig[hintTier] || tierConfig[1];

  // Tier 3: auto-dismiss after 5s
  useEffect(() => {
    if (isVisible && config.autoAdvance) {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, config.autoAdvance, onDismiss]);

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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`w-full max-w-sm rounded-3xl bg-card p-8 shadow-xl text-center border-2 ${config.bgAccent} relative overflow-hidden`}
          >
            {/* Glow effect for tier 2+ */}
            {config.glow && (
              <div className="absolute inset-0 bg-accent/5 animate-pulse pointer-events-none" />
            )}

            {/* Tier indicator dots */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map((t) => (
                <div
                  key={t}
                  className={`h-2 w-2 rounded-full transition-all ${
                    t <= hintTier ? "bg-accent scale-125" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 8 }}
              className={`${config.iconSize} mb-4`}
            >
              {config.icon}
            </motion.p>

            {/* Tier label */}
            <p className="text-caption text-muted-foreground mb-2">
              {hintTier === 1 && "A little nudge..."}
              {hintTier === 2 && "Let me help you focus..."}
              {hintTier === 3 && "Here's where to look!"}
            </p>

            <p className="text-xl text-card-foreground mb-8 leading-relaxed">{hintText}</p>

            {/* Auto-advance countdown for tier 3 */}
            {config.autoAdvance && (
              <p className="text-caption text-muted-foreground mb-4">
                I'll show you in a moment...
              </p>
            )}

            <Button
              onClick={onDismiss}
              variant={hintTier >= 3 ? "default" : "accent"}
              size="lg"
              className="w-full gap-2"
            >
              {config.buttonText}
              {hintTier >= 3 && <ArrowRight className="h-5 w-5" />}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HintOverlay;
