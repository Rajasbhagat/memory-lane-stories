import { useState, useCallback } from "react";

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

export function useVoiceSession() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState<string | null>(null);

  const startListening = useCallback(() => {
    setVoiceState("listening");
    setTranscript(null);
    // Mock: simulate transcript after 2s
    setTimeout(() => {
      setTranscript("I see the problem!");
      setVoiceState("processing");
      setTimeout(() => {
        setVoiceState("idle");
      }, 500);
    }, 2000);
  }, []);

  const stopListening = useCallback(() => {
    setVoiceState("processing");
    setTimeout(() => {
      setVoiceState("idle");
    }, 500);
  }, []);

  const submitText = useCallback((text: string) => {
    setTranscript(text);
    setVoiceState("processing");
    setTimeout(() => {
      setVoiceState("idle");
    }, 500);
  }, []);

  return {
    voiceState,
    transcript,
    startListening,
    stopListening,
    submitText,
  };
}
