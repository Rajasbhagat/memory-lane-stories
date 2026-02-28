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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 rounded-2xl bg-card p-4 shadow-md"
    >
      {/* Voice Error */}
      {voiceError && (
        <div className="flex w-full items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{voiceError}</span>
          {onClearError && (
            <button onClick={onClearError} className="shrink-0">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Status */}
      <p className="text-sm text-muted-foreground">{stateLabels[state]}</p>

      {/* Mic Button */}
      <div className="relative">
        {state === "listening" && (
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
        )}
        <Button
          onClick={handleMicClick}
          disabled={disabled || state === "processing" || state === "speaking"}
          className={`h-16 w-16 rounded-full ${
            state === "listening"
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-primary hover:bg-primary/90"
          } text-primary-foreground`}
          size="icon"
        >
          {state === "listening" ? (
            <MicOff className="h-7 w-7" />
          ) : (
            <Mic className="h-7 w-7" />
          )}
        </Button>
      </div>

      {/* Waveform — visible during listening AND speaking */}
      {showWaveform && (
        <div className="flex h-8 items-center gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-1 rounded-full ${state === "speaking" ? "bg-accent" : "bg-primary"}`}
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
        <p className="text-center text-sm text-muted-foreground italic">"{transcript}"</p>
      )}

      {/* Text fallback */}
      <div className="flex w-full gap-2">
        <Input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
          placeholder="Or type your answer here..."
          className="h-12 flex-1 text-body"
          disabled={disabled}
        />
        <Button
          onClick={handleTextSubmit}
          disabled={disabled || !textInput.trim()}
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default VoiceControls;
