import { motion, AnimatePresence } from "framer-motion";

interface NPCCompanionProps {
  text: string;
  isTyping?: boolean;
  mood?: "neutral" | "happy" | "thinking";
  streamingText?: string;
}

const NPCCompanion = ({ text, isTyping = false, mood = "neutral", streamingText }: NPCCompanionProps) => {
  const displayText = streamingText || text;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-start gap-4 rounded-3xl bg-card p-6 shadow-md border-2 border-border"
    >
      {/* SVG Avatar — 72px preferred touch target */}
      <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
        <svg viewBox="0 0 64 64" className="h-16 w-16" aria-label="Detective Johnny">
          {/* Hat */}
          <ellipse cx="32" cy="18" rx="22" ry="6" fill="hsl(217, 20%, 35%)" />
          <rect x="14" y="12" width="36" height="8" rx="2" fill="hsl(217, 20%, 30%)" />
          <rect x="18" y="8" width="28" height="8" rx="4" fill="hsl(217, 20%, 35%)" />
          {/* Hat band */}
          <rect x="18" y="14" width="28" height="2" fill="hsl(38, 92%, 50%)" />
          
          {/* Face */}
          <circle cx="32" cy="36" r="16" fill="hsl(30, 40%, 78%)" />
          
          {/* Eyes */}
          {mood === "thinking" ? (
            <>
              <ellipse cx="26" cy="34" rx="2.5" ry="1.5" fill="hsl(217, 20%, 25%)" />
              <ellipse cx="38" cy="33" rx="2.5" ry="1.5" fill="hsl(217, 20%, 25%)" />
            </>
          ) : (
            <>
              <circle cx="26" cy="34" r="2.5" fill="hsl(217, 20%, 25%)" />
              <circle cx="38" cy="34" r="2.5" fill="hsl(217, 20%, 25%)" />
              <circle cx="27" cy="33" r="0.8" fill="white" />
              <circle cx="39" cy="33" r="0.8" fill="white" />
            </>
          )}
          
          {/* Eyebrows */}
          {mood === "thinking" ? (
            <>
              <line x1="23" y1="30" x2="29" y2="29" stroke="hsl(217, 20%, 30%)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="35" y1="29" x2="41" y2="31" stroke="hsl(217, 20%, 30%)" strokeWidth="1.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <line x1="23" y1="30" x2="29" y2="30" stroke="hsl(217, 20%, 30%)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="35" y1="30" x2="41" y2="30" stroke="hsl(217, 20%, 30%)" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
          
          {/* Nose */}
          <ellipse cx="32" cy="38" rx="1.5" ry="2" fill="hsl(30, 30%, 68%)" />
          
          {/* Mouth */}
          {mood === "happy" ? (
            <path d="M26 43 Q32 49 38 43" fill="none" stroke="hsl(217, 20%, 30%)" strokeWidth="1.5" strokeLinecap="round" />
          ) : mood === "thinking" ? (
            <ellipse cx="34" cy="44" rx="3" ry="2" fill="hsl(217, 20%, 30%)" />
          ) : (
            <path d="M27 44 Q32 46 37 44" fill="none" stroke="hsl(217, 20%, 30%)" strokeWidth="1.5" strokeLinecap="round" />
          )}
          
          {/* Coat collar */}
          <path d="M18 52 L26 48 L32 52 L38 48 L46 52" fill="hsl(217, 20%, 40%)" stroke="hsl(217, 20%, 35%)" strokeWidth="1" />
        </svg>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1">
        <p className="text-caption font-bold text-primary mb-2">Detective Johnny</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={streamingText ? "streaming" : text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-speech text-card-foreground"
          >
            {displayText}
            {isTyping && (
              <span className="ml-1 inline-flex gap-0.5">
                <span className="animate-bounce text-primary" style={{ animationDelay: "0ms" }}>.</span>
                <span className="animate-bounce text-primary" style={{ animationDelay: "150ms" }}>.</span>
                <span className="animate-bounce text-primary" style={{ animationDelay: "300ms" }}>.</span>
              </span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NPCCompanion;
