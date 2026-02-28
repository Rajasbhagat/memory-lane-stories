import { useState } from "react";
import { motion } from "framer-motion";
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
  processing: "Processing...",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center gap-5 rounded-3xl bg-card p-6 shadow-md border-2 border-border"
    >
      {/* Voice Error */}
      {voiceError && (
        <div className="flex w-full items-center gap-3 rounded-2xl bg-destructive/10 p-4 text-body text-destructive">
          <AlertCircle className="h-6 w-6 shrink-0" />
          <span className="flex-1">{voiceError}</span>
          {onClearError && (
            <button onClick={onClearError} className="shrink-0 min-h-touch min-w-touch flex items-center justify-center">
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
      )}

      {/* Status */}
      <p className="text-body text-muted-foreground">{stateLabels[state]}</p>

      {/* Mic Button — 96px for primary voice action */}
      <div className="relative">
        {state === "listening" && (
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
        )}
        <Button
          onClick={handleMicClick}
          disabled={disabled || state === "processing" || state === "speaking"}
          className={`min-h-touch-xl min-w-touch-xl rounded-full ${
            state === "listening"
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-primary hover:bg-primary/90"
          } text-primary-foreground`}
          size="icon-lg"
        >
          {state === "listening" ? (
            <MicOff className="h-10 w-10" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </Button>
      </div>

      {/* Waveform */}
      {showWaveform && (
        <div className="flex h-10 items-center gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 rounded-full ${state === "speaking" ? "bg-accent" : "bg-primary"}`}
              animate={{
                height: [8, 20 + Math.random() * 12, 8],
              }}
              transition={{
                duration: state === "speaking" ? 0.8 : 0.6,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <p className="text-center text-body text-muted-foreground italic">"{transcript}"</p>
      )}

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
