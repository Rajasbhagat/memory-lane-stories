import { motion, AnimatePresence } from "framer-motion";

interface NPCCompanionProps {
  text: string;
  isTyping?: boolean;
  mood?: "neutral" | "happy" | "thinking";
}

const moodEmoji: Record<string, string> = {
  neutral: "🕵️",
  happy: "😄",
  thinking: "🤔",
};

const NPCCompanion = ({ text, isTyping = false, mood = "neutral" }: NPCCompanionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4 rounded-2xl bg-card p-4 shadow-md"
    >
      {/* Avatar */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/15 text-3xl">
        {moodEmoji[mood]}
      </div>

      {/* Speech Bubble */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-speech text-card-foreground"
          >
            {text}
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
