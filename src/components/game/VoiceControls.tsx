import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VoiceState } from "@/hooks/useVoiceSession";

interface VoiceControlsProps {
  state: VoiceState;
  transcript: string | null;
  onStartListening: () => void;
  onStopListening: () => void;
  onTextSubmit: (text: string) => void;
  disabled?: boolean;
  voiceError?: string | null;
  onClearError?: () => void;
}

const stateLabels: Record<VoiceState, string> = {
  idle: "Tap to speak",
  listening: "Listening...",
  processing: "Thinking...",
  speaking: "Johnny is speaking...",
};

const VoiceControls = ({
  state,
  transcript,
  onStartListening,
  onStopListening,
  onTextSubmit,
  disabled = false,
  voiceError,
  onClearError,
}: VoiceControlsProps) => {
  const [textInput, setTextInput] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const transcriptTimer = useRef<ReturnType<typeof setTimeout>>();

  // Show transcript overlay for 3s then fade out
  useEffect(() => {
    if (transcript) {
      setShowTranscript(true);
      clearTimeout(transcriptTimer.current);
      transcriptTimer.current = setTimeout(() => setShowTranscript(false), 3000);
    }
    return () => clearTimeout(transcriptTimer.current);
  }, [transcript]);

  const handleMicClick = () => {
    if (disabled) return;
    if (state === "listening") {
      onStopListening();
    } else if (state === "idle") {
      onStartListening();
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim() && !disabled) {
      onTextSubmit(textInput.trim());
      setTextInput("");
    }
  };

  const showWaveform = state === "listening" || state === "speaking";
  const isListening = state === "listening";
  const isError = !!voiceError;

  // Color-coded mic button styles
  const micButtonClass = isListening
    ? "bg-accent hover:bg-accent/90 shadow-[0_0_20px_hsl(var(--accent)/0.4)]"
    : isError
      ? "bg-destructive hover:bg-destructive/90 animate-shake"
      : disabled || state === "processing" || state === "speaking"
        ? "bg-muted text-muted-foreground"
        : "bg-primary hover:bg-primary/90";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center gap-5 rounded-3xl bg-card p-6 shadow-md border-2 border-border"
    >
      {/* Voice Error */}
      <AnimatePresence>
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex w-full items-center gap-3 rounded-2xl bg-destructive/10 p-4 text-body text-destructive"
          >
            <AlertCircle className="h-6 w-6 shrink-0" />
            <span className="flex-1">{voiceError}</span>
            {onClearError && (
              <button onClick={onClearError} className="shrink-0 min-h-touch min-w-touch flex items-center justify-center">
                <X className="h-6 w-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status */}
      <p className={`text-lg font-semibold ${isListening ? "text-accent" : "text-muted-foreground"}`}>
        {stateLabels[state]}
      </p>

      {/* Mic Button — 96px, color-coded states, ping effect */}
      <div className="relative">
        {/* Ping rings when listening */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-[-8px] rounded-full border-2 border-accent/40"
              animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-[-4px] rounded-full border-2 border-accent/30"
              animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            />
          </>
        )}
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Button
            onClick={handleMicClick}
            disabled={disabled || state === "processing" || state === "speaking"}
            className={`min-h-touch-xl min-w-touch-xl rounded-full text-primary-foreground transition-all duration-300 ${micButtonClass}`}
            size="icon-lg"
          >
            {isListening ? (
              <MicOff className="h-12 w-12" />
            ) : (
              <Mic className="h-12 w-12" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Waveform */}
      {showWaveform && (
        <div className="flex h-10 items-center gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 rounded-full ${state === "speaking" ? "bg-primary" : "bg-accent"}`}
              animate={{
                height: [8, 20 + Math.random() * 12, 8],
              }}
              transition={{
                duration: state === "speaking" ? 0.8 : 0.5,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      )}

      {/* Transcript overlay — 3s fadeout */}
      <AnimatePresence>
        {showTranscript && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-primary/10 px-5 py-3 text-center"
          >
            <p className="text-body text-primary italic">You said: "{transcript}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text fallback */}
      <div className="flex w-full gap-3">
        <Input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
          placeholder="Or type your answer here..."
          className="flex-1"
          disabled={disabled}
        />
        <Button
          onClick={handleTextSubmit}
          disabled={disabled || !textInput.trim()}
          className="min-h-touch min-w-touch rounded-full bg-primary text-primary-foreground"
          size="icon"
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>
    </motion.div>
  );
};

export default VoiceControls;
